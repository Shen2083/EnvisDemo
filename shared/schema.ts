import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, integer, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  email: text("email").unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const families = pgTable("families", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  createdById: varchar("created_by_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const familyMembers = pgTable("family_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  familyId: varchar("family_id").notNull().references(() => families.id),
  userId: varchar("user_id").notNull().references(() => users.id), // NOT NULL - every member must have a user
  role: text("role").notNull(), // "admin" | "member"
  status: text("status").notNull(), // "active" | "pending" | "removed"
  joinedAt: timestamp("joined_at").defaultNow(),
});

// Production constraints to add:
// - UNIQUE (family_id, user_id) on family_members
// - UNIQUE (family_id, external_account_id) on connected_accounts  
// - UNIQUE (account_id, user_id) on account_owners
// - FK check: account_owners.user_id must exist in family_members for same family

export const familyInvites = pgTable("family_invites", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  familyId: varchar("family_id").notNull().references(() => families.id),
  email: text("email").notNull(),
  invitedBy: varchar("invited_by").references(() => users.id),
  status: text("status").notNull().default("pending"), // "pending" | "accepted" | "expired"
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const connectedAccounts = pgTable("connected_accounts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  familyId: varchar("family_id").notNull().references(() => families.id),
  externalAccountId: text("external_account_id").notNull(), // Provider's unique account ID for duplicate detection
  ownershipType: text("ownership_type").notNull(), // "individual" | "joint"
  bankName: text("bank_name").notNull(),
  accountType: text("account_type").notNull(),
  accountNumber: text("account_number"), // May be masked/unavailable
  balance: decimal("balance", { precision: 10, scale: 2 }),
  currency: text("currency").default("GBP"),
  status: text("status").notNull().default("connected"), // "connected" | "needs_refresh" | "error"
  lastSyncedAt: timestamp("last_synced_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const accountOwners = pgTable("account_owners", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  accountId: varchar("account_id").notNull().references(() => connectedAccounts.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  isPrimary: boolean("is_primary").default(false), // For joint accounts, one can be primary contact
  addedAt: timestamp("added_at").defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  accountId: varchar("account_id").notNull().references(() => connectedAccounts.id),
  familyId: varchar("family_id").notNull().references(() => families.id),
  description: text("description").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  category: text("category").notNull(),
  date: timestamp("date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const goals = pgTable("goals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  familyId: varchar("family_id").notNull().references(() => families.id),
  name: text("name").notNull(),
  targetAmount: decimal("target_amount", { precision: 10, scale: 2 }).notNull(),
  currentAmount: decimal("current_amount", { precision: 10, scale: 2 }).default("0"),
  targetDate: timestamp("target_date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  firstName: true,
  lastName: true,
  email: true,
});

export const insertFamilySchema = createInsertSchema(families).pick({
  name: true,
});

export const insertFamilyMemberSchema = createInsertSchema(familyMembers).pick({
  familyId: true,
  userId: true,
  role: true,
  status: true,
});

export const insertFamilyInviteSchema = createInsertSchema(familyInvites).pick({
  familyId: true,
  email: true,
  invitedBy: true,
  token: true,
  expiresAt: true,
});

export const insertConnectedAccountSchema = createInsertSchema(connectedAccounts).pick({
  familyId: true,
  externalAccountId: true,
  ownershipType: true,
  bankName: true,
  accountType: true,
  accountNumber: true,
  balance: true,
  currency: true,
  status: true,
});

export const insertAccountOwnerSchema = createInsertSchema(accountOwners).pick({
  accountId: true,
  userId: true,
  isPrimary: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).pick({
  accountId: true,
  familyId: true,
  description: true,
  amount: true,
  category: true,
  date: true,
});

export const insertGoalSchema = createInsertSchema(goals).pick({
  familyId: true,
  name: true,
  targetAmount: true,
  currentAmount: true,
  targetDate: true,
});

// Select types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Family = typeof families.$inferSelect;
export type InsertFamily = z.infer<typeof insertFamilySchema>;

export type FamilyMember = typeof familyMembers.$inferSelect;
export type InsertFamilyMember = z.infer<typeof insertFamilyMemberSchema>;

export type FamilyInvite = typeof familyInvites.$inferSelect;
export type InsertFamilyInvite = z.infer<typeof insertFamilyInviteSchema>;

export type ConnectedAccount = typeof connectedAccounts.$inferSelect;
export type InsertConnectedAccount = z.infer<typeof insertConnectedAccountSchema>;

export type AccountOwner = typeof accountOwners.$inferSelect;
export type InsertAccountOwner = z.infer<typeof insertAccountOwnerSchema>;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

export type Goal = typeof goals.$inferSelect;
export type InsertGoal = z.infer<typeof insertGoalSchema>;
