import {
  User,
  InsertUser,
  Document,
  InsertDocument,
  Collaboration,
  InsertCollaboration,
  Comment,
  InsertComment,
  Template,
  InsertTemplate,
  ChatHistory,
  InsertChatHistory,
  Activity,
  InsertActivity,
  LegalReference,
  InsertLegalReference
} from "@shared/schema";

// Interface for all storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Document operations
  getDocument(id: number): Promise<Document | undefined>;
  getDocumentsByUserId(userId: number): Promise<Document[]>;
  createDocument(document: InsertDocument): Promise<Document>;
  updateDocument(id: number, document: InsertDocument): Promise<Document | undefined>;
  deleteDocument(id: number): Promise<boolean>;
  
  // Collaboration operations
  getCollaborationsByDocumentId(documentId: number): Promise<Collaboration[]>;
  getCollaborationsByUserId(userId: number): Promise<Collaboration[]>;
  createCollaboration(collaboration: InsertCollaboration): Promise<Collaboration>;
  
  // Comment operations
  getCommentsByDocumentId(documentId: number): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  
  // Template operations
  getAllTemplates(): Promise<Template[]>;
  getTemplatesByProvince(province: string): Promise<Template[]>;
  getTemplatesByType(type: string): Promise<Template[]>;
  getTemplatesByProvinceAndType(province: string, type: string): Promise<Template[]>;
  
  // Chat operations
  getChatHistory(userId: number): Promise<ChatHistory | undefined>;
  addChatMessage(userId: number, message: { role: string, content: string }): Promise<ChatHistory>;
  
  // Activity operations
  getActivitiesByUserId(userId: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  
  // Legal reference operations
  getLegalReferencesByProvince(province: string): Promise<LegalReference[]>;
  getLegalReferencesByCategory(category: string): Promise<LegalReference[]>;
}

// In-memory implementation of storage
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private documents: Map<number, Document>;
  private collaborations: Map<number, Collaboration>;
  private comments: Map<number, Comment>;
  private templates: Map<number, Template>;
  private chatHistory: Map<number, ChatHistory>;
  private activities: Map<number, Activity>;
  private legalReferences: Map<number, LegalReference>;
  
  private currentIds: {
    user: number;
    document: number;
    collaboration: number;
    comment: number;
    template: number;
    chatHistory: number;
    activity: number;
    legalReference: number;
  };

  constructor() {
    this.users = new Map();
    this.documents = new Map();
    this.collaborations = new Map();
    this.comments = new Map();
    this.templates = new Map();
    this.chatHistory = new Map();
    this.activities = new Map();
    this.legalReferences = new Map();
    
    this.currentIds = {
      user: 1,
      document: 1,
      collaboration: 1,
      comment: 1,
      template: 1,
      chatHistory: 1,
      activity: 1,
      legalReference: 1
    };
    
    // Initialize with a default user
    this.users.set(1, {
      id: 1,
      username: "johnsmith",
      password: "password123",
      name: "John Smith",
      email: "john@example.com",
      role: "user",
      accountType: "individual",
      createdAt: new Date()
    });
    
    // Initialize with some sample documents
    this.documents.set(1, {
      id: 1,
      title: "Employment Agreement - ABC Corp",
      content: "This is a sample employment agreement...",
      type: "Employment",
      province: "Ontario",
      status: "Active",
      isAIGenerated: false,
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    this.documents.set(2, {
      id: 2,
      title: "Non-Disclosure Agreement",
      content: "This is a sample NDA...",
      type: "NDA",
      province: "British Columbia",
      status: "Review Needed",
      isAIGenerated: true,
      userId: 1,
      createdAt: new Date(Date.now() - 86400000),  // yesterday
      updatedAt: new Date(Date.now() - 86400000)
    });
    
    this.documents.set(3, {
      id: 3,
      title: "Residential Lease Agreement",
      content: "This is a sample lease agreement...",
      type: "Lease",
      province: "Quebec",
      status: "Draft",
      isAIGenerated: false,
      userId: 1,
      createdAt: new Date(Date.now() - 86400000 * 2),  // 2 days ago
      updatedAt: new Date(Date.now() - 86400000 * 2)
    });
    
    // Initialize with some sample activities
    this.activities.set(1, {
      id: 1,
      userId: 1,
      documentId: 1,
      activityType: "ai_analyzed",
      description: "AI Assistant analyzed and provided suggestions for your Employment Agreement",
      createdAt: new Date()
    });
    
    this.activities.set(2, {
      id: 2,
      userId: 1,
      documentId: 2,
      activityType: "commented",
      description: "Sarah Johnson commented on your NDA document",
      createdAt: new Date(Date.now() - 86400000)
    });
    
    this.activities.set(3, {
      id: 3,
      userId: 1,
      documentId: 3,
      activityType: "risk_analyzed",
      description: "Risk Analysis completed for Residential Lease Agreement",
      createdAt: new Date(Date.now() - 86400000 * 2)
    });
    
    // Initialize with sample templates for common document types by province
    const documentTypes = ["Employment", "NDA", "Lease", "Partnership", "Service"];
    const provinces = ["Ontario", "British Columbia", "Alberta", "Quebec"];
    
    let templateId = 1;
    
    documentTypes.forEach(type => {
      provinces.forEach(province => {
        this.templates.set(templateId, {
          id: templateId,
          title: `${type} Agreement Template - ${province}`,
          content: `This is a standard ${type} agreement template for ${province}...`,
          type,
          province,
          category: "Standard",
          isDefault: true,
          createdAt: new Date()
        });
        
        templateId++;
      });
    });
    
    // Initialize with some basic legal references
    const legalCategories = ["Employment", "Privacy", "Real Estate", "Business"];
    let refId = 1;
    
    provinces.forEach(province => {
      legalCategories.forEach(category => {
        this.legalReferences.set(refId, {
          id: refId,
          title: `${category} Law Reference - ${province}`,
          content: `Key provisions and regulations regarding ${category} law in ${province}...`,
          province,
          category,
          source: "Canadian Legal Database",
          createdAt: new Date()
        });
        
        refId++;
      });
    });
    
    this.currentIds.template = templateId;
    this.currentIds.legalReference = refId;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentIds.user++;
    const user: User = { 
      ...insertUser, 
      id, 
      role: insertUser.role || "user",
      accountType: insertUser.accountType || "individual",
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  // Document operations
  async getDocument(id: number): Promise<Document | undefined> {
    return this.documents.get(id);
  }

  async getDocumentsByUserId(userId: number): Promise<Document[]> {
    return Array.from(this.documents.values()).filter(
      (doc) => doc.userId === userId
    );
  }

  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const id = this.currentIds.document++;
    const now = new Date();
    const document: Document = { 
      ...insertDocument, 
      id, 
      createdAt: now,
      updatedAt: now
    };
    this.documents.set(id, document);
    return document;
  }

  async updateDocument(id: number, updateDocument: InsertDocument): Promise<Document | undefined> {
    const document = this.documents.get(id);
    
    if (!document) return undefined;
    
    const updatedDocument: Document = {
      ...document,
      ...updateDocument,
      id,
      updatedAt: new Date()
    };
    
    this.documents.set(id, updatedDocument);
    return updatedDocument;
  }

  async deleteDocument(id: number): Promise<boolean> {
    return this.documents.delete(id);
  }

  // Collaboration operations
  async getCollaborationsByDocumentId(documentId: number): Promise<Collaboration[]> {
    return Array.from(this.collaborations.values()).filter(
      (collab) => collab.documentId === documentId
    );
  }

  async getCollaborationsByUserId(userId: number): Promise<Collaboration[]> {
    return Array.from(this.collaborations.values()).filter(
      (collab) => collab.userId === userId
    );
  }

  async createCollaboration(insertCollaboration: InsertCollaboration): Promise<Collaboration> {
    const id = this.currentIds.collaboration++;
    const collaboration: Collaboration = { 
      ...insertCollaboration, 
      id,
      createdAt: new Date()
    };
    this.collaborations.set(id, collaboration);
    return collaboration;
  }

  // Comment operations
  async getCommentsByDocumentId(documentId: number): Promise<Comment[]> {
    return Array.from(this.comments.values())
      .filter((comment) => comment.documentId === documentId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const id = this.currentIds.comment++;
    const comment: Comment = { 
      ...insertComment, 
      id,
      createdAt: new Date()
    };
    this.comments.set(id, comment);
    return comment;
  }

  // Template operations
  async getAllTemplates(): Promise<Template[]> {
    return Array.from(this.templates.values());
  }

  async getTemplatesByProvince(province: string): Promise<Template[]> {
    return Array.from(this.templates.values()).filter(
      (template) => template.province === province
    );
  }

  async getTemplatesByType(type: string): Promise<Template[]> {
    return Array.from(this.templates.values()).filter(
      (template) => template.type === type
    );
  }

  async getTemplatesByProvinceAndType(province: string, type: string): Promise<Template[]> {
    return Array.from(this.templates.values()).filter(
      (template) => template.province === province && template.type === type
    );
  }

  // Chat operations
  async getChatHistory(userId: number): Promise<ChatHistory | undefined> {
    return this.chatHistory.get(userId);
  }

  async addChatMessage(userId: number, message: { role: string, content: string }): Promise<ChatHistory> {
    let chatHistory = this.chatHistory.get(userId);
    const now = new Date();
    
    if (!chatHistory) {
      chatHistory = {
        id: this.currentIds.chatHistory++,
        userId,
        messages: [],
        createdAt: now,
        updatedAt: now
      };
    }
    
    chatHistory.messages = [...chatHistory.messages, message];
    chatHistory.updatedAt = now;
    
    this.chatHistory.set(userId, chatHistory);
    return chatHistory;
  }

  // Activity operations
  async getActivitiesByUserId(userId: number): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .filter((activity) => activity.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = this.currentIds.activity++;
    const activity: Activity = { 
      ...insertActivity, 
      id,
      createdAt: new Date()
    };
    this.activities.set(id, activity);
    return activity;
  }

  // Legal reference operations
  async getLegalReferencesByProvince(province: string): Promise<LegalReference[]> {
    return Array.from(this.legalReferences.values()).filter(
      (ref) => ref.province === province
    );
  }

  async getLegalReferencesByCategory(category: string): Promise<LegalReference[]> {
    return Array.from(this.legalReferences.values()).filter(
      (ref) => ref.category === category
    );
  }
}

import * as schema from "@shared/schema";
import { eq } from "drizzle-orm";
import { db } from "./db";
import { pool } from "./db";
import connectPg from "connect-pg-simple";
import session from "express-session";

const PostgresSessionStore = connectPg(session);

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true,
      tableName: "session" 
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(schema.users).where(eq(schema.users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(schema.users).where(eq(schema.users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(schema.users).values({
      ...insertUser,
      role: insertUser.role || "user",
      accountType: insertUser.accountType || "individual"
    }).returning();
    return user;
  }
  
  // Document operations
  async getDocument(id: number): Promise<Document | undefined> {
    const [document] = await db.select().from(schema.documents).where(eq(schema.documents.id, id));
    return document;
  }

  async getDocumentsByUserId(userId: number): Promise<Document[]> {
    return await db.select().from(schema.documents).where(eq(schema.documents.userId, userId));
  }

  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const [document] = await db.insert(schema.documents).values({
      ...insertDocument,
      status: insertDocument.status || "draft"
    }).returning();
    return document;
  }

  async updateDocument(id: number, updateDocument: InsertDocument): Promise<Document | undefined> {
    const [document] = await db
      .update(schema.documents)
      .set({
        ...updateDocument,
        status: updateDocument.status || "draft"
      })
      .where(eq(schema.documents.id, id))
      .returning();
    return document;
  }

  async deleteDocument(id: number): Promise<boolean> {
    const result = await db.delete(schema.documents).where(eq(schema.documents.id, id));
    return !!result;
  }
  
  // Collaboration operations
  async getCollaborationsByDocumentId(documentId: number): Promise<Collaboration[]> {
    return await db.select().from(schema.collaborations).where(eq(schema.collaborations.documentId, documentId));
  }

  async getCollaborationsByUserId(userId: number): Promise<Collaboration[]> {
    return await db.select().from(schema.collaborations).where(eq(schema.collaborations.userId, userId));
  }

  async createCollaboration(insertCollaboration: InsertCollaboration): Promise<Collaboration> {
    const [collaboration] = await db.insert(schema.collaborations).values({
      ...insertCollaboration,
      role: insertCollaboration.role || "viewer"
    }).returning();
    return collaboration;
  }
  
  // Comment operations
  async getCommentsByDocumentId(documentId: number): Promise<Comment[]> {
    return await db.select().from(schema.comments).where(eq(schema.comments.documentId, documentId));
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const [comment] = await db.insert(schema.comments).values({
      ...insertComment,
      position: insertComment.position || null
    }).returning();
    return comment;
  }
  
  // Template operations
  async getAllTemplates(): Promise<Template[]> {
    return await db.select().from(schema.templates);
  }

  async getTemplatesByProvince(province: string): Promise<Template[]> {
    return await db.select().from(schema.templates).where(eq(schema.templates.province, province));
  }

  async getTemplatesByType(type: string): Promise<Template[]> {
    return await db.select().from(schema.templates).where(eq(schema.templates.type, type));
  }

  async getTemplatesByProvinceAndType(province: string, type: string): Promise<Template[]> {
    return await db.select()
      .from(schema.templates)
      .where(eq(schema.templates.province, province))
      .where(eq(schema.templates.type, type));
  }
  
  // Chat operations
  async getChatHistory(userId: number): Promise<ChatHistory | undefined> {
    const [history] = await db.select().from(schema.chatHistory).where(eq(schema.chatHistory.userId, userId));
    return history;
  }

  async addChatMessage(userId: number, message: { role: string, content: string }): Promise<ChatHistory> {
    const existingHistory = await this.getChatHistory(userId);
    
    if (existingHistory) {
      const messages = JSON.parse(existingHistory.messages as string);
      messages.push(message);
      
      const [updated] = await db
        .update(schema.chatHistory)
        .set({ messages: JSON.stringify(messages) })
        .where(eq(schema.chatHistory.id, existingHistory.id))
        .returning();
      
      return updated;
    } else {
      const [history] = await db
        .insert(schema.chatHistory)
        .values({
          userId,
          messages: JSON.stringify([message])
        })
        .returning();
      
      return history;
    }
  }
  
  // Activity operations
  async getActivitiesByUserId(userId: number): Promise<Activity[]> {
    return await db.select().from(schema.activities).where(eq(schema.activities.userId, userId));
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const [activity] = await db.insert(schema.activities).values({
      ...insertActivity,
      documentId: insertActivity.documentId || null
    }).returning();
    return activity;
  }
  
  // Legal reference operations
  async getLegalReferencesByProvince(province: string): Promise<LegalReference[]> {
    return await db.select().from(schema.legalReferences).where(eq(schema.legalReferences.province, province));
  }

  async getLegalReferencesByCategory(category: string): Promise<LegalReference[]> {
    return await db.select().from(schema.legalReferences).where(eq(schema.legalReferences.category, category));
  }
}

// Switch from MemStorage to DatabaseStorage
export const storage = new DatabaseStorage();
