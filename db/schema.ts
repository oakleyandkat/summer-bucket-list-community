import {
  pgTable,
  text,
  timestamp,
  primaryKey,
  uniqueIndex,
  jsonb,
} from "drizzle-orm/pg-core";

export type QuizAnswers = {
  movie?: string;
  fridayNight?: string;
  snack?: string;
  soundtrack?: string;
  vacation?: string;
  sideQuest?: string;
  chaos?: string;
  takenAt?: string;
};

export const accounts = pgTable("account", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  pinHash: text("pin_hash").notNull(),
  quizAnswers: jsonb("quiz_answers").$type<QuizAnswers>(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const rooms = pgTable(
  "room",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    code: text("code").notNull(),
    name: text("name").notNull(),
    ownerId: text("owner_id")
      .notNull()
      .references(() => accounts.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  },
  (t) => [uniqueIndex("room_code_unique").on(t.code)]
);

export const roomMembers = pgTable(
  "room_member",
  {
    roomId: text("room_id")
      .notNull()
      .references(() => rooms.id, { onDelete: "cascade" }),
    accountId: text("account_id")
      .notNull()
      .references(() => accounts.id, { onDelete: "cascade" }),
    joinedAt: timestamp("joined_at", { mode: "date" }).defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.roomId, t.accountId] })]
);

// `ideaKey` is "c-<n>" for one of the 72 canonical ideas (defined in lib/ideas.ts)
// or "s-<uuid>" for a room-specific suggestion. Unifies voting + checks.
export const suggestions = pgTable("suggestion", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  roomId: text("room_id")
    .notNull()
    .references(() => rooms.id, { onDelete: "cascade" }),
  text: text("text").notNull(),
  emoji: text("emoji"),
  authorId: text("author_id")
    .notNull()
    .references(() => accounts.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const votes = pgTable(
  "vote",
  {
    roomId: text("room_id")
      .notNull()
      .references(() => rooms.id, { onDelete: "cascade" }),
    accountId: text("account_id")
      .notNull()
      .references(() => accounts.id, { onDelete: "cascade" }),
    ideaKey: text("idea_key").notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.roomId, t.accountId, t.ideaKey] })]
);

export const personalChecks = pgTable(
  "personal_check",
  {
    accountId: text("account_id")
      .notNull()
      .references(() => accounts.id, { onDelete: "cascade" }),
    ideaKey: text("idea_key").notNull(),
    checkedAt: timestamp("checked_at", { mode: "date" }).defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.accountId, t.ideaKey] })]
);
