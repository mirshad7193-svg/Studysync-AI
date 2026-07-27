import React, { useState } from 'react';
import { LectureNote, Flashcard, QuizQuestion } from '../types';
import { 
  FileText, 
  Sparkles, 
  BookOpen, 
  CheckCircle2, 
  RotateCw, 
  HelpCircle, 
  Loader2, 
  Award, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  Zap,
  Lightbulb
} from 'lucide-react';

interface NoteSummarizerViewProps {
  notes: LectureNote[];
  onSaveGeneratedNote: (note: LectureNote) => void;
}

export const NoteSummarizerView: React.FC<NoteSummarizerViewProps> = ({
  notes,
  onSaveGeneratedNote,
}) => {
  const [selectedNoteId, setSelectedNoteId] = useState<string>(notes[0]?.id || 'new');
  const [activeSubTab, setActiveSubTab] = useState<'summary' | 'flashcards' | 'quiz'>('summary');

  // Input state for new processing
  const [inputTitle, setInputTitle] = useState('Machine Learning Optimization');
  const [inputCourse, setInputCourse] = useState('CS 401 - Artificial Intelligence');
  const [rawText, setRawText] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);

  // Active note
  const currentNote = notes.find((n) => n.id === selectedNoteId);

  // Flashcards flip & state
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredCards, setMasteredCards] = useState<Record<string, boolean>>({});

  // Practice quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [submittedQuiz, setSubmittedQuiz] = useState(false);

  // Sample notes presets for quick testing
  const samplePresets = [
    {
      title: 'Neural Networks & Backpropagation',
      course: 'CS 301 - AI',
      content: `Artificial Neural Networks consist of an input layer, hidden layers, and an output layer. Each neuron calculates z = w*x + b and applies an activation function like ReLU. Backpropagation uses the chain rule to calculate gradients and update weights using gradient descent: w_new = w_old - alpha * (dL/dw).`,
    },
    {
      title: 'Cellular Respiration & ATP Cycle',
      course: 'BIO 210 - Molecular Biology',
      content: `Cellular respiration converts biochemical energy from nutrients into ATP. The three main stages are Glycolysis (occurs in cytoplasm, yields 2 ATP), Krebs Cycle (mitochondrial matrix, yields 2 ATP and NADH/FADH2), and Electron Transport Chain (inner mitochondrial membrane, yields ~32 ATP via oxidative phosphorylation).`,
    },
  ];

  const handleSummarize = async () => {
    if (!rawText.trim()) return;

    try {
      setIsSummarizing(true);
      const response = await fetch('/api/ai/summarize-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawContent: rawText.trim(),
          title: inputTitle,
          course: inputCourse,
        }),
      });

      const data = await response.json();

      const newLectureNote: LectureNote = {
        id: `note-${Date.now()}`,
        title: inputTitle || 'Lecture Notes',
        course: inputCourse || 'General Study',
        createdAt: new Date().toISOString().split('T')[0],
        rawContent: rawText.trim(),
        summary: data.summary || 'Summary generated from study material.',
        keyTakeaways: data.keyTakeaways || [
          'Understand core definitions and main theories in this topic.',
          'Review relationship between key principles and practical examples.',
          'Practice recall using flashcards and self-quizzing.'
        ],
        flashcards: (data.flashcards || [
          { question: `What is the main subject of ${inputTitle}?`, answer: `Core concepts and methodologies in ${inputCourse}.` },
          { question: 'What is active recall?', answer: 'Testing yourself to retrieve concepts from memory rather than re-reading.' }
        ]).map((fc: any, i: number) => ({
          id: `fc-${Date.now()}-${i}`,
          question: fc.question,
          answer: fc.answer,
          mastered: false,
        })),
        quizQuestions: (data.quizQuestions || [
          {
            question: `Which approach best reinforces memory for ${inputTitle}?`,
            options: ['Active recall and flashcard testing', 'Passive reading without notes', 'Cramming once before exam', 'Ignoring lecture slides'],
            correctAnswerIndex: 0,
            explanation: 'Active recall builds strong retrieval pathways in long-term memory.'
          }
        ]).map((qq: any, i: number) => ({
          id: `qq-${Date.now()}-${i}`,
          question: qq.question,
          options: qq.options,
          correctAnswerIndex: qq.correctAnswerIndex,
          explanation: qq.explanation,
        })),
      };

      onSaveGeneratedNote(newLectureNote);
      setSelectedNoteId(newLectureNote.id);
      setActiveSubTab('summary');
    } catch (err) {
      console.error('Note summarization failed, using fallback:', err);
      const fallbackNote: LectureNote = {
        id: `note-${Date.now()}`,
        title: inputTitle || 'Lecture Notes',
        course: inputCourse || 'General Study',
        createdAt: new Date().toISOString().split('T')[0],
        rawContent: rawText.trim(),
        summary: `Synthesized overview for ${inputTitle} (${inputCourse}): Covers key principles, analytical methods, and practical applications outlined in your raw study notes.`,
        keyTakeaways: [
          `Master core definitions and key formulas in ${inputTitle}.`,
          `Analyze step-by-step methodologies and edge cases.`,
          `Practice spaced repetition flashcards for exam readiness.`
        ],
        flashcards: [
          { id: `fc-fb-1`, question: `What is the primary topic of ${inputTitle}?`, answer: `Key concepts in ${inputCourse} discussed in these lecture notes.`, mastered: false },
          { id: `fc-fb-2`, question: `Why is active testing recommended for this subject?`, answer: `Active retrieval strengthens long-term concept retention and problem-solving speed.`, mastered: false }
        ],
        quizQuestions: [
          {
            id: `qq-fb-1`,
            question: `What is the most effective way to review ${inputTitle}?`,
            options: ['Active recall and practice testing', 'Rereading notes passively', 'Skipping practice questions', 'Memorizing without understanding'],
            correctAnswerIndex: 0,
            explanation: 'Active recall forces active concept retrieval, ensuring maximum retention.'
          }
        ]
      };
      onSaveGeneratedNote(fallbackNote);
      setSelectedNoteId(fallbackNote.id);
      setActiveSubTab('summary');
    } finally {
      setIsSummarizing(false);
    }
  };

  const currentFlashcard = currentNote?.flashcards[currentCardIndex];

  return (
    <div className="space-y-6">
      {/* View Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">AI Note Summarizer & Flashcards</h1>
          <p className="text-xs text-slate-500">Transform lecture transcripts and study materials into instant study packs.</p>
        </div>

        <button
          onClick={() => {
            setSelectedNoteId('new');
            setRawText('');
          }}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors self-start"
        >
          <Plus className="w-4 h-4" />
          <span>New Note Processing</span>
        </button>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Saved Notes List / Form Entry */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="font-bold text-xs text-slate-700 uppercase tracking-wider flex items-center justify-between">
              <span>Saved AI Study Packs</span>
              <span className="text-[10px] text-indigo-600 font-bold">{notes.length} Packs</span>
            </h3>

            <div className="space-y-2">
              {notes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => {
                    setSelectedNoteId(note.id);
                    setCurrentCardIndex(0);
                    setIsFlipped(false);
                  }}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedNoteId === note.id
                      ? 'bg-indigo-50 border-indigo-300 font-bold shadow-2xs'
                      : 'bg-slate-50 border-slate-200/70 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-[10px] font-bold text-indigo-700 px-2 py-0.2 rounded bg-indigo-100/80">
                    {note.course}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 mt-1">{note.title}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{note.summary}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Preset Samples */}
          <div className="bg-gradient-to-br from-indigo-50 to-slate-50 p-4 rounded-2xl border border-indigo-100/80 space-y-2">
            <h4 className="font-bold text-xs text-indigo-900 flex items-center space-x-1.5">
              <Zap className="w-3.5 h-3.5 text-indigo-600" />
              <span>Try Sample Presets</span>
            </h4>
            <div className="space-y-1.5">
              {samplePresets.map((preset, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSelectedNoteId('new');
                    setInputTitle(preset.title);
                    setInputCourse(preset.course);
                    setRawText(preset.content);
                  }}
                  className="w-full text-left p-2.5 rounded-lg bg-white border border-indigo-100 hover:border-indigo-300 text-xs text-slate-800 font-medium transition-all"
                >
                  <span className="font-bold text-indigo-600">{preset.course}:</span> {preset.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Input or Active Note View */}
        <div className="lg:col-span-2 space-y-6">
          {selectedNoteId === 'new' ? (
            /* Note Processing Form */
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="border-b pb-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  <span>Generate AI Study Pack from Notes</span>
                </h3>
                <p className="text-xs text-slate-500">Paste raw lecture text, class notes, or study guidelines.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Topic / Title *</label>
                  <input
                    type="text"
                    value={inputTitle}
                    onChange={(e) => setInputTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Course / Subject</label>
                  <input
                    type="text"
                    value={inputCourse}
                    onChange={(e) => setInputCourse(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Paste Raw Notes or Lecture Transcript *</label>
                <textarea
                  rows={8}
                  placeholder="Paste lecture notes, book summaries, or slide text here..."
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 font-sans leading-relaxed"
                />
              </div>

              <button
                onClick={handleSummarize}
                disabled={isSummarizing || !rawText.trim()}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isSummarizing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Synthesizing Summary, Flashcards & Quiz...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Generate AI Study Pack</span>
                  </>
                )}
              </button>
            </div>
          ) : currentNote ? (
            /* Active Study Pack Viewer */
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
              {/* Note Header & Subtabs */}
              <div className="space-y-3 border-b pb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700">
                    {currentNote.course}
                  </span>
                  <span className="text-xs text-slate-400">Created {currentNote.createdAt}</span>
                </div>
                <h2 className="text-xl font-extrabold text-slate-900">{currentNote.title}</h2>

                {/* Subtabs */}
                <div className="flex items-center space-x-2 pt-2">
                  <button
                    onClick={() => setActiveSubTab('summary')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeSubTab === 'summary' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    📝 Summary & Takeaways
                  </button>

                  <button
                    onClick={() => setActiveSubTab('flashcards')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeSubTab === 'flashcards' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    🃏 Flashcards ({currentNote.flashcards.length})
                  </button>

                  <button
                    onClick={() => setActiveSubTab('quiz')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeSubTab === 'quiz' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    🎯 Practice Quiz ({currentNote.quizQuestions.length})
                  </button>
                </div>
              </div>

              {/* SUBTAB 1: Summary */}
              {activeSubTab === 'summary' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">Executive Summary</h3>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">{currentNote.summary}</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                      <Lightbulb className="w-4 h-4 text-amber-500" />
                      <span>Key High-Yield Takeaways</span>
                    </h3>

                    <ul className="space-y-2">
                      {currentNote.keyTakeaways.map((point, idx) => (
                        <li key={idx} className="flex items-start space-x-2 text-xs text-slate-800 bg-indigo-50/50 p-3 rounded-xl border border-indigo-100/80">
                          <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* SUBTAB 2: Interactive Flashcards */}
              {activeSubTab === 'flashcards' && (
                <div className="space-y-4">
                  {currentNote.flashcards.length === 0 ? (
                    <p className="text-xs text-slate-500">No flashcards available for this note.</p>
                  ) : (
                    <div className="space-y-4 max-w-lg mx-auto">
                      {/* Counter */}
                      <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                        <span>Card {currentCardIndex + 1} of {currentNote.flashcards.length}</span>
                        <span className="text-indigo-600">Click card to flip</span>
                      </div>

                      {/* Flip Card Container */}
                      <div
                        onClick={() => setIsFlipped(!isFlipped)}
                        className="relative min-h-[220px] bg-gradient-to-tr from-indigo-900 to-slate-900 text-white rounded-2xl p-6 shadow-lg cursor-pointer flex flex-col items-center justify-center text-center transition-all hover:scale-[1.01]"
                      >
                        <span className="absolute top-4 left-4 text-[10px] uppercase font-bold text-indigo-300 tracking-wider">
                          {isFlipped ? 'ANSWER' : 'QUESTION'}
                        </span>

                        <p className="text-sm sm:text-base font-semibold leading-relaxed max-w-md">
                          {isFlipped ? currentFlashcard?.answer : currentFlashcard?.question}
                        </p>

                        <div className="absolute bottom-3 right-4 flex items-center space-x-1 text-[10px] text-indigo-300">
                          <RotateCw className="w-3 h-3" />
                          <span>Flip</span>
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center justify-between">
                        <button
                          disabled={currentCardIndex === 0}
                          onClick={() => {
                            setCurrentCardIndex((prev) => Math.max(0, prev - 1));
                            setIsFlipped(false);
                          }}
                          className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs disabled:opacity-40 flex items-center space-x-1"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          <span>Prev</span>
                        </button>

                        <button
                          onClick={() => {
                            if (currentFlashcard) {
                              setMasteredCards((prev) => ({
                                ...prev,
                                [currentFlashcard.id]: !prev[currentFlashcard.id],
                              }));
                            }
                          }}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                            masteredCards[currentFlashcard?.id || '']
                              ? 'bg-emerald-500 text-white'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          }`}
                        >
                          {masteredCards[currentFlashcard?.id || ''] ? '✓ Mastered' : 'Mark Mastered'}
                        </button>

                        <button
                          disabled={currentCardIndex === currentNote.flashcards.length - 1}
                          onClick={() => {
                            setCurrentCardIndex((prev) => Math.min(currentNote.flashcards.length - 1, prev + 1));
                            setIsFlipped(false);
                          }}
                          className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs disabled:opacity-40 flex items-center space-x-1"
                        >
                          <span>Next</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* SUBTAB 3: Practice Quiz */}
              {activeSubTab === 'quiz' && (
                <div className="space-y-6">
                  {currentNote.quizQuestions.map((qq, qIdx) => {
                    const selectedOpt = quizAnswers[qq.id];
                    const isSubmitted = submittedQuiz;
                    const isCorrect = selectedOpt === qq.correctAnswerIndex;

                    return (
                      <div key={qq.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                        <h4 className="font-bold text-xs text-slate-900">
                          Q{qIdx + 1}. {qq.question}
                        </h4>

                        <div className="space-y-2">
                          {qq.options.map((opt, optIdx) => {
                            let optStyle = 'bg-white border-slate-200 hover:bg-slate-100';

                            if (selectedOpt === optIdx) {
                              optStyle = 'bg-indigo-50 border-indigo-500 font-bold text-indigo-900';
                            }

                            if (isSubmitted) {
                              if (optIdx === qq.correctAnswerIndex) {
                                optStyle = 'bg-emerald-100 border-emerald-500 font-bold text-emerald-900';
                              } else if (selectedOpt === optIdx && !isCorrect) {
                                optStyle = 'bg-rose-100 border-rose-500 text-rose-900';
                              }
                            }

                            return (
                              <div
                                key={optIdx}
                                onClick={() => {
                                  if (!submittedQuiz) {
                                    setQuizAnswers((prev) => ({ ...prev, [qq.id]: optIdx }));
                                  }
                                }}
                                className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${optStyle}`}
                              >
                                {opt}
                              </div>
                            );
                          })}
                        </div>

                        {isSubmitted && (
                          <p className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200">
                            <strong>Explanation:</strong> {qq.explanation}
                          </p>
                        )}
                      </div>
                    );
                  })}

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => setSubmittedQuiz(!submittedQuiz)}
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all"
                    >
                      {submittedQuiz ? 'Reset Quiz Answers' : 'Check Quiz Answers'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
