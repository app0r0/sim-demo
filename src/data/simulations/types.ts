// シミュレーションの型定義。
// 設問を編集するときは、各企業のファイル（例：toray-rd.ts）だけを触れば OK です。

/** 判断傾向の4軸 */
export type Axis = "explore" | "verify" | "business" | "collab";

export const AXES: Axis[] = ["explore", "verify", "business", "collab"];

export type ChoiceId = "A" | "B" | "C" | "D";

/** 監修ステータス（画面には表示しない管理用） */
export type ReviewStatus = "draft" | "reviewed";

type ChoiceBase = {
  id: ChoiceId;
  /** 選択肢の本文 */
  text: string;
  /** この選択肢を選んだ人に表示する解説（2〜3文） */
  explanation: string;
  /** 他の選択肢を選んだ人に表示する要点（1文程度） */
  point: string;
};

export type KnowledgeChoice = ChoiceBase & {
  /** 不正解だが「部分的に妥当」なときに true（採点には影響しない） */
  partial?: boolean;
};

export type JudgmentChoice = ChoiceBase & {
  /** 選ぶと1点加算される軸 */
  axis: Axis;
};

type QuestionBase = {
  /** 設問ID（例："q1"） */
  id: string;
  /** フェーズ番号（phases の id に対応） */
  phase: number;
  /** 問題文 */
  prompt: string;
  /** 全選択肢に共通する補足（任意） */
  note?: string;
  reviewStatus: ReviewStatus;
};

/** 知識チェック：正解が1つある */
export type KnowledgeQuestion = QuestionBase & {
  type: "knowledge";
  correct: ChoiceId;
  choices: KnowledgeChoice[];
};

/** 判断：正解なし。選んだ選択肢の軸に1点 */
export type JudgmentQuestion = QuestionBase & {
  type: "judgment";
  choices: JudgmentChoice[];
};

export type Question = KnowledgeQuestion | JudgmentQuestion;

export type Simulation = {
  slug: string;
  /** 画面上部・タブに出るタイトル */
  title: string;
  /** イントロの小見出し（英字） */
  eyebrow: string;
  /** イントロの見出し */
  headline: string;
  /** 見出し下のリード文 */
  lead: string;
  /** 状況設定（段落ごと） */
  situation: string[];
  /** 所要時間の表示 */
  duration: string;
  phases: { id: number; name: string }[];
  axes: Record<Axis, { label: string; description: string; comment: string }>;
  /** 結果コメントの最後に必ず添える一文 */
  closingNote: string;
  questions: Question[];
};
