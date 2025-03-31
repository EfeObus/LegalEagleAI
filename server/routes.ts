import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertDocumentSchema, 
  insertUserSchema,
  insertCommentSchema,
  insertChatHistorySchema,
  insertActivitySchema
} from "@shared/schema";
import { generateLegalDocument, summarizeLegalDocument, legalChatAssistant, analyzeLegalRisk, getProvincialLawInfo } from "./openai";
import { z, ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

// Mock user for development purposes
const MOCK_USER_ID = 1;

export async function registerRoutes(app: Express): Promise<Server> {
  // User authentication routes
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json({ success: true, user: { ...user, password: undefined } });
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedError = fromZodError(error);
        res.status(400).json({ message: formattedError.message });
      } else {
        res.status(500).json({ message: "Failed to register user" });
      }
    }
  });

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      res.json({ success: true, user: { ...user, password: undefined } });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Document routes
  app.get("/api/documents", async (req: Request, res: Response) => {
    try {
      const documents = await storage.getDocumentsByUserId(MOCK_USER_ID);
      res.json(documents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  app.get("/api/documents/:id", async (req: Request, res: Response) => {
    try {
      const documentId = parseInt(req.params.id);
      const document = await storage.getDocument(documentId);
      
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      
      res.json(document);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch document" });
    }
  });

  app.post("/api/documents", async (req: Request, res: Response) => {
    try {
      const documentData = insertDocumentSchema.parse({
        ...req.body,
        userId: MOCK_USER_ID
      });
      
      const document = await storage.createDocument(documentData);
      
      // Create activity record
      await storage.createActivity({
        userId: MOCK_USER_ID,
        documentId: document.id,
        activityType: "created",
        description: `Created document: ${document.title}`
      });
      
      res.json(document);
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedError = fromZodError(error);
        res.status(400).json({ message: formattedError.message });
      } else {
        res.status(500).json({ message: "Failed to create document" });
      }
    }
  });

  app.put("/api/documents/:id", async (req: Request, res: Response) => {
    try {
      const documentId = parseInt(req.params.id);
      const documentData = insertDocumentSchema.parse({
        ...req.body,
        userId: MOCK_USER_ID
      });
      
      const document = await storage.updateDocument(documentId, documentData);
      
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      
      // Create activity record
      await storage.createActivity({
        userId: MOCK_USER_ID,
        documentId: document.id,
        activityType: "updated",
        description: `Updated document: ${document.title}`
      });
      
      res.json(document);
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedError = fromZodError(error);
        res.status(400).json({ message: formattedError.message });
      } else {
        res.status(500).json({ message: "Failed to update document" });
      }
    }
  });

  app.delete("/api/documents/:id", async (req: Request, res: Response) => {
    try {
      const documentId = parseInt(req.params.id);
      const success = await storage.deleteDocument(documentId);
      
      if (!success) {
        return res.status(404).json({ message: "Document not found" });
      }
      
      // Create activity record
      await storage.createActivity({
        userId: MOCK_USER_ID,
        documentId: documentId,
        activityType: "deleted",
        description: `Deleted document ID: ${documentId}`
      });
      
      res.json({ success });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete document" });
    }
  });

  // Comment routes
  app.get("/api/documents/:id/comments", async (req: Request, res: Response) => {
    try {
      const documentId = parseInt(req.params.id);
      const comments = await storage.getCommentsByDocumentId(documentId);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  app.post("/api/documents/:id/comments", async (req: Request, res: Response) => {
    try {
      const documentId = parseInt(req.params.id);
      const commentData = insertCommentSchema.parse({
        ...req.body,
        documentId,
        userId: MOCK_USER_ID
      });
      
      const comment = await storage.createComment(commentData);
      
      // Create activity record
      await storage.createActivity({
        userId: MOCK_USER_ID,
        documentId: documentId,
        activityType: "commented",
        description: "Added a comment to the document"
      });
      
      res.json(comment);
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedError = fromZodError(error);
        res.status(400).json({ message: formattedError.message });
      } else {
        res.status(500).json({ message: "Failed to create comment" });
      }
    }
  });

  // Template routes
  app.get("/api/templates", async (req: Request, res: Response) => {
    try {
      const { province, type } = req.query;
      let templates;
      
      if (province && type) {
        templates = await storage.getTemplatesByProvinceAndType(
          province as string, 
          type as string
        );
      } else if (province) {
        templates = await storage.getTemplatesByProvince(province as string);
      } else if (type) {
        templates = await storage.getTemplatesByType(type as string);
      } else {
        templates = await storage.getAllTemplates();
      }
      
      res.json(templates);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch templates" });
    }
  });

  // AI Document Generation
  app.post("/api/ai/generate-document", async (req: Request, res: Response) => {
    try {
      const requestSchema = z.object({
        documentType: z.string(),
        province: z.string(),
        parameters: z.record(z.any())
      });
      
      const { documentType, province, parameters } = requestSchema.parse(req.body);
      
      const generatedContent = await generateLegalDocument(
        documentType,
        province,
        parameters
      );
      
      // Create activity record
      await storage.createActivity({
        userId: MOCK_USER_ID,
        activityType: "ai_generated",
        description: `Generated ${documentType} document for ${province}`
      });
      
      res.json({ content: generatedContent });
    } catch (error: any) {
      if (error instanceof ZodError) {
        const formattedError = fromZodError(error);
        res.status(400).json({ message: formattedError.message });
      } else {
        console.error("Error generating legal document:", error.message);
        
        // Check if it's an API quota error (429)
        if (error.message && error.message.includes("429")) {
          return res.status(429).json({ 
            message: "AI service quota exceeded. Please try again later.",
            error: "RATE_LIMIT_EXCEEDED" 
          });
        }
        
        res.status(500).json({ message: "Failed to generate document" });
      }
    }
  });

  // Document Summary
  app.post("/api/ai/summarize", async (req: Request, res: Response) => {
    try {
      const requestSchema = z.object({
        documentContent: z.string(),
        detailLevel: z.enum(["brief", "detailed"]).default("detailed")
      });
      
      const { documentContent, detailLevel } = requestSchema.parse(req.body);
      
      const summary = await summarizeLegalDocument(documentContent, detailLevel);
      
      // Create activity record
      await storage.createActivity({
        userId: MOCK_USER_ID,
        activityType: "ai_summarized",
        description: `Generated a ${detailLevel} summary of a document`
      });
      
      res.json(summary);
    } catch (error: any) {
      if (error instanceof ZodError) {
        const formattedError = fromZodError(error);
        res.status(400).json({ message: formattedError.message });
      } else {
        console.error("Error summarizing legal document:", error.message);
        
        // Check if it's an API quota error (429)
        if (error.message && error.message.includes("429")) {
          return res.status(429).json({ 
            message: "AI service quota exceeded. Please try again later.",
            error: "RATE_LIMIT_EXCEEDED" 
          });
        }
        
        res.status(500).json({ message: "Failed to summarize document" });
      }
    }
  });

  // Legal Chat Assistant
  app.post("/api/ai/chat", async (req: Request, res: Response) => {
    try {
      const requestSchema = z.object({
        messages: z.array(z.object({
          role: z.enum(["user", "assistant", "system"]),
          content: z.string()
        })),
        province: z.string().default("General")
      });
      
      const { messages, province } = requestSchema.parse(req.body);
      
      const response = await legalChatAssistant(messages, province);
      
      // Save to chat history
      await storage.addChatMessage(MOCK_USER_ID, {
        role: "assistant",
        content: response
      });
      
      res.json({ response });
    } catch (error: any) {
      if (error instanceof ZodError) {
        const formattedError = fromZodError(error);
        res.status(400).json({ message: formattedError.message });
      } else {
        console.error("Error with legal chat assistant:", error.message);
        
        // Check if it's an API quota error (429)
        if (error.message && error.message.includes("429")) {
          return res.status(429).json({ 
            message: "AI service quota exceeded. Please try again later.",
            error: "RATE_LIMIT_EXCEEDED" 
          });
        }
        
        res.status(500).json({ message: "Failed to get chat response" });
      }
    }
  });

  // Risk Analysis
  app.post("/api/ai/analyze-risk", async (req: Request, res: Response) => {
    try {
      const requestSchema = z.object({
        documentContent: z.string(),
        province: z.string()
      });
      
      const { documentContent, province } = requestSchema.parse(req.body);
      
      const riskAnalysis = await analyzeLegalRisk(documentContent, province);
      
      // Create activity record
      await storage.createActivity({
        userId: MOCK_USER_ID,
        activityType: "risk_analyzed",
        description: `Analyzed risk for a document under ${province} law`
      });
      
      res.json(riskAnalysis);
    } catch (error: any) {
      if (error instanceof ZodError) {
        const formattedError = fromZodError(error);
        res.status(400).json({ message: formattedError.message });
      } else {
        console.error("Error analyzing legal risk:", error.message);
        
        // Check if it's an API quota error (429)
        if (error.message && error.message.includes("429")) {
          return res.status(429).json({ 
            message: "AI service quota exceeded. Please try again later.",
            error: "RATE_LIMIT_EXCEEDED" 
          });
        }
        
        res.status(500).json({ message: "Failed to analyze risk" });
      }
    }
  });

  // Provincial Law Information
  app.get("/api/legal-info/:province/:topic", async (req: Request, res: Response) => {
    try {
      const { province, topic } = req.params;
      
      const legalInfo = await getProvincialLawInfo(province, topic);
      
      // Create activity record
      await storage.createActivity({
        userId: MOCK_USER_ID,
        activityType: "legal_research",
        description: `Researched ${topic} law in ${province}`
      });
      
      res.json(legalInfo);
    } catch (error: any) {
      console.error("Error getting provincial law info:", error.message);
      
      // Check if it's an API quota error (429)
      if (error.message && error.message.includes("429")) {
        return res.status(429).json({ 
          message: "API rate limit exceeded. Please try again later.",
          error: "RATE_LIMIT_EXCEEDED" 
        });
      }
      
      res.status(500).json({ message: "Failed to get legal information" });
    }
  });

  // Activity routes
  app.get("/api/activities", async (req: Request, res: Response) => {
    try {
      const activities = await storage.getActivitiesByUserId(MOCK_USER_ID);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
