import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  role: text("role").notNull().default("user"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

// Document model
export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  type: text("type").notNull(),
  province: text("province").notNull(),
  status: text("status").notNull().default("draft"),
  isAIGenerated: boolean("is_ai_generated").default(false),
  userId: integer("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Collaboration model
export const collaborations = pgTable("collaborations", {
  id: serial("id").primaryKey(),
  documentId: integer("document_id").notNull(),
  userId: integer("user_id").notNull(),
  role: text("role").notNull().default("viewer"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCollaborationSchema = createInsertSchema(collaborations).omit({
  id: true,
  createdAt: true,
});

// Comment model for document collaboration
export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  documentId: integer("document_id").notNull(),
  userId: integer("user_id").notNull(),
  content: text("content").notNull(),
  position: text("position"), // Where in the document the comment applies to
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  createdAt: true,
});

// Template model
export const templates = pgTable("templates", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  type: text("type").notNull(),
  province: text("province").notNull(),
  category: text("category").notNull(),
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTemplateSchema = createInsertSchema(templates).omit({
  id: true,
  createdAt: true,
});

// AI Chat history model
export const chatHistory = pgTable("chat_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  messages: jsonb("messages").notNull().default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertChatHistorySchema = createInsertSchema(chatHistory).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Activity model
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  documentId: integer("document_id"),
  activityType: text("activity_type").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  createdAt: true,
});

// Canadian legal reference model
export const legalReferences = pgTable("legal_references", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  province: text("province").notNull(),
  category: text("category").notNull(),
  source: text("source").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertLegalReferenceSchema = createInsertSchema(legalReferences).omit({
  id: true,
  createdAt: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Document = typeof documents.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;

export type Collaboration = typeof collaborations.$inferSelect;
export type InsertCollaboration = z.infer<typeof insertCollaborationSchema>;

export type Comment = typeof comments.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;

export type Template = typeof templates.$inferSelect;
export type InsertTemplate = z.infer<typeof insertTemplateSchema>;

export type ChatHistory = typeof chatHistory.$inferSelect;
export type InsertChatHistory = z.infer<typeof insertChatHistorySchema>;

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;

export type LegalReference = typeof legalReferences.$inferSelect;
export type InsertLegalReference = z.infer<typeof insertLegalReferenceSchema>;
