import {
  pgTable,
  text,
  timestamp,
  primaryKey,
  uniqueIndex,
  jsonb,
  integer,
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
  coins: integer("coins").default(0).notNull(),
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
    coinsAwarded: integer("coins_awarded").default(0).notNull(),
  },
  (t) => [primaryKey({ columns: [t.accountId, t.ideaKey] })]
);

// Which packs an account has unlocked. Pack metadata lives in lib/packs.ts
// (it's product content, not user data) — we only track the unlock here.
export const accountPacks = pgTable(
  "account_pack",
  {
    accountId: text("account_id")
      .notNull()
      .references(() => accounts.id, { onDelete: "cascade" }),
    packSlug: text("pack_slug").notNull(),
    unlockedAt: timestamp("unlocked_at", { mode: "date" }).defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.accountId, t.packSlug] })]
);

// One photo per (account, idea). Re-uploading replaces. `photo` is a base64
// data URL the client compresses before sending — keep it under ~1MB.
export const memories = pgTable(
  "memory",
  {
    accountId: text("account_id")
      .notNull()
      .references(() => accounts.id, { onDelete: "cascade" }),
    ideaKey: text("idea_key").notNull(),
    photo: text("photo").notNull(),
    caption: text("caption"),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.accountId, t.ideaKey] })]
);
