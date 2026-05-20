
import MultipleChoice    from "./types/MultipleChoice";
import TextEntry         from "./types/TextEntry";
import ListeningCard     from "./types/ListeningCard";
import OrderingCard      from "./types/OrderingCard";
import TranslationCard   from "./types/TranslationCard";
import PronunciationCard from "./types/PronunciationCard";
import MatchingCard      from "./types/MatchingCard";
import DragAndDropCard   from "./types/DragAndDropCard";
import MultipleAnswerCard from "./types/MultipleAnswerCard";
 
export default function QuestionFactory({ question, ...props }) {
  console.log("סוג השאלה שהגיע מהשרת:", question?.title, "המסכה היא:", question?.questionTypeMask);
  const mask = question.questionTypeMask;
 
  // 1. Pronunciation (2048) — תמיד UI ייחודי
  if (mask & 2048) return <PronunciationCard question={question} {...props} />;
 
  // 2. Translation (131072)
  if (mask & 131072) return <TranslationCard question={question} {...props} />;
 
  // 3. Matching (65536)
  if (mask & 65536) return <MatchingCard question={question} {...props} />;
 
  // 4. Ordering (8) / DragAndDrop (1024)
  if (mask & 1024) return <DragAndDropCard question={question} {...props} />;
  if (mask & 8)    return <OrderingCard    question={question} {...props} />;
 
  // 5. Listening (32) / ReadingComprehension (64)
  // חובה לפני בדיקת MultipleChoice! כי mask=33 (1+32) ו-65 (1+64)
  // היו נתפסים בטעות כ-MultipleChoice בגלל ה-1
  if (mask & 32 || mask & 64) return <ListeningCard question={question} {...props} />;
 
  // 6. MultipleAnswer (4096) — צ'קבוקסים, יותר מתשובה אחת
  if (mask & 4096) return <MultipleAnswerCard question={question} {...props} />;
 
  // 7. ShortAnswer (16) / AudioResponse (256) — תמיד טקסט חופשי
  if (mask & 16 || mask & 256) return <TextEntry question={question} {...props} />;
 
  // 8. FillInTheBlank (2) / ClozeTest (512)
  // אם יש אפשרויות → MultipleChoice עם רווח בשאלה
  // אם אפשרות אחת → TextEntry (הקלדה חופשית)
  if (mask & 2 || mask & 512) {
    if (question.options?.length === 1) return <TextEntry question={question} {...props} />;
    return <MultipleChoice question={question} {...props} />;
  }
 
  // 9. כל השאר (1=MC, 4=TrueFalse, 8192=Spelling, 16384=ConvCompletion, 128=PictureBased...)
  return <MultipleChoice question={question} {...props} />;
}
 