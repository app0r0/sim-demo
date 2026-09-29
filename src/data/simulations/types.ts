// シミュレーションの型定義。
// 設問を編集するときは、各企業のファイル（例：toray-rd.ts）だけを触れば OK です。

export type ChoiceId = "A" | "B" | "C" | "D";

/** 監修ステータス（画面には表示しない管理用） */
export type ReviewStatus = "draft" | "reviewed";

export type Choice = {
  id: ChoiceId;
  /** 選択肢の本文 */
  text: string;
  /**
   * この選択肢の解説（2〜3文）。
   * trap の選択肢は「直感では〜と考えがちですが、実際は〜」の形で書く。
   */
  explanation: string;
  /** 他の選択肢を選んだ人に表示する要点（1文） */
  point: string;
  /** 常識や直感で選びたくなる誤答（各問1つ） */
  trap?: boolean;
};

export type Question = {
  /** 設問ID（例："q1"） */
  id: string;
  /** フェーズ番号（phases の id に対応） */
  phase: number;
  /** 関連する大学の科目（例："物理化学（浸透圧）"） */
  subject: string;
  /** 科目別スコアの集計先（categories の id に対応） */
  category: string;
  /** 結果画面の「場面」一覧に出す短い説明 */
  scene: string;
  /** 問題文 */
  prompt: string;
  /** 正解の記号。正解が2つある問題は ["B", "D"] のように書く */
  correct: ChoiceId[];
  choices: Choice[];
  /** 問題全体の解説 */
  commentary: string;
  reviewStatus: ReviewStatus;
};

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
  /** 科目別スコアの分類（表示順） */
  categories: { id: string; label: string }[];
  /** 結果画面の下部に置く固定の紹介 */
  related: { heading: string; items: { name: string; text: string }[] };
  questions: Question[];
};
