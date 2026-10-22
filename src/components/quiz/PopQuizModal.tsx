import React, { useEffect, useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '@/context/AppContext';
import { PopQuiz } from '@/types';

interface PopQuizModalProps {
  visible: boolean;
  quiz?: PopQuiz | null;
  onClose: () => void;
}

export const PopQuizModal: React.FC<PopQuizModalProps> = ({ visible, quiz, onClose }) => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const { popQuizzes, showAlert } = useApp();

  const [selectedQuizId, setSelectedQuizId] = useState<string>(
    quiz?.id || (popQuizzes[0] ? popQuizzes[0].id : '')
  );

  useEffect(() => {
    if (quiz?.id) {
      setSelectedQuizId(quiz.id);
    }
  }, [quiz]);

  const activeQuiz =
    popQuizzes.find((q) => q.id === selectedQuizId) || quiz || popQuizzes[0];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(30);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);

  // Reset quiz state when opened
  useEffect(() => {
    if (visible) {
      setCurrentQuestionIndex(0);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setScore(0);
      setIsQuizCompleted(false);
      setTimerSeconds(30);
      setUserAnswers([]);
    }
  }, [visible, selectedQuizId]);

  // Question timer
  useEffect(() => {
    if (!visible || isQuizCompleted || isAnswerSubmitted) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          // Time up! Auto-reveal
          setIsAnswerSubmitted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [visible, isQuizCompleted, isAnswerSubmitted, currentQuestionIndex]);

  if (!activeQuiz) return null;

  const currentQ = activeQuiz.questions[currentQuestionIndex];
  const totalQuestions = activeQuiz.questions.length;

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
    setIsAnswerSubmitted(true);
    setUserAnswers((prev) => {
      const next = [...prev];
      next[currentQuestionIndex] = idx;
      return next;
    });

    if (idx === currentQ.correctIndex) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex + 1 < totalQuestions) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setTimerSeconds(30);
    } else {
      setIsQuizCompleted(true);
    }
  };

  const percentage = Math.round((score / totalQuestions) * 100);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.aiBadge}>
              <Ionicons name="sparkles" size={14} color="#6366F1" />
              <Text style={styles.aiBadgeText}>AI POP QUIZ</Text>
            </View>
            <Text style={styles.quizTitle} numberOfLines={1}>
              {activeQuiz.title}
            </Text>
            <Text style={styles.quizSub}>
              {activeQuiz.subject} • {activeQuiz.topic}
            </Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={22} color="#475569" />
          </TouchableOpacity>
        </View>

        {/* QUIZ SELECTOR CHIPS (If multiple quizzes available) */}
        {popQuizzes.length > 1 && (
          <View style={styles.quizSelectorBar}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.quizSelectorScroll}>
              {popQuizzes.map((q) => {
                const isCurrent = q.id === activeQuiz.id;
                return (
                  <TouchableOpacity
                    key={q.id}
                    style={[styles.quizSelectorPill, isCurrent && styles.quizSelectorPillActive]}
                    onPress={() => {
                      setSelectedQuizId(q.id);
                      setCurrentQuestionIndex(0);
                      setSelectedOption(null);
                      setIsAnswerSubmitted(false);
                      setScore(0);
                      setIsQuizCompleted(false);
                      setTimerSeconds(30);
                      setUserAnswers([]);
                    }}>
                    <Ionicons name="sparkles" size={12} color={isCurrent ? '#4F46E5' : '#64748B'} />
                    <Text
                      style={[
                        styles.quizSelectorText,
                        isCurrent && styles.quizSelectorTextActive,
                      ]}>
                      {q.subject}: {q.title}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={[styles.contentContainer, isDesktop && styles.contentDesktop]}
          showsVerticalScrollIndicator={false}>
          {!isQuizCompleted ? (
            <View style={styles.quizCard}>
              {/* PROGRESS & TIMER BAR */}
              <View style={styles.progressRow}>
                <View style={styles.progressTextCol}>
                  <Text style={styles.progressText}>
                    Question {currentQuestionIndex + 1} of {totalQuestions}
                  </Text>
                  <View style={styles.progressBarTrack}>
                    <View
                      style={[
                        styles.progressBarFill,
                        { width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` },
                      ]}
                    />
                  </View>
                </View>

                <View
                  style={[
                    styles.timerPill,
                    timerSeconds <= 5 && styles.timerPillUrgent,
                  ]}>
                  <Ionicons
                    name="time-outline"
                    size={14}
                    color={timerSeconds <= 5 ? '#EF4444' : '#6366F1'}
                  />
                  <Text
                    style={[
                      styles.timerText,
                      timerSeconds <= 5 && styles.timerTextUrgent,
                    ]}>
                    {timerSeconds}s
                  </Text>
                </View>
              </View>

              {/* QUESTION TEXT */}
              <View style={styles.questionBox}>
                <Text style={styles.questionText}>{currentQ.question}</Text>
              </View>

              {/* OPTIONS LIST */}
              <View style={styles.optionsList}>
                {currentQ.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === currentQ.correctIndex;
                  const showResult = isAnswerSubmitted;

                  let optExtraStyle: any = null;
                  let textExtraStyle: any = null;
                  let iconName: keyof typeof Ionicons.glyphMap = 'ellipse-outline';
                  let iconColor = '#94A3B8';

                  if (showResult) {
                    if (isCorrect) {
                      optExtraStyle = styles.optionItemCorrect;
                      textExtraStyle = styles.optionTextCorrect;
                      iconName = 'checkmark-circle';
                      iconColor = '#10B981';
                    } else if (isSelected && !isCorrect) {
                      optExtraStyle = styles.optionItemWrong;
                      textExtraStyle = styles.optionTextWrong;
                      iconName = 'close-circle';
                      iconColor = '#EF4444';
                    }
                  } else if (isSelected) {
                    optExtraStyle = styles.optionItemSelected;
                    textExtraStyle = styles.optionTextSelected;
                    iconName = 'radio-button-on';
                    iconColor = '#4F46E5';
                  }

                  return (
                    <TouchableOpacity
                      key={idx}
                      style={[styles.optionItem, optExtraStyle]}
                      onPress={() => handleSelectOption(idx)}
                      disabled={isAnswerSubmitted}
                      activeOpacity={0.7}>
                      <View style={styles.optionContent}>
                        <View style={styles.optionIndexPill}>
                          <Text style={styles.optionIndexLetter}>
                            {String.fromCharCode(65 + idx)}
                          </Text>
                        </View>
                        <Text style={[styles.optionText, textExtraStyle]}>{opt}</Text>
                      </View>
                      <Ionicons name={iconName} size={20} color={iconColor} />
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* AI EXPLANATION BOX (Revealed after selection) */}
              {isAnswerSubmitted && (
                <View style={styles.explanationCard}>
                  <View style={styles.explanationHeader}>
                    <Ionicons name="bulb" size={16} color="#D97706" />
                    <Text style={styles.explanationTitle}>AI Tutor Insight & Explanation</Text>
                  </View>
                  <Text style={styles.explanationBody}>{currentQ.explanation}</Text>
                </View>
              )}

              {/* NEXT / CONTINUE BUTTON */}
              {isAnswerSubmitted && (
                <TouchableOpacity style={styles.nextBtn} onPress={handleNext} activeOpacity={0.85}>
                  <LinearGradient
                    colors={['#4F46E5', '#6366F1']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.nextGradient}>
                    <Text style={styles.nextBtnText}>
                      {currentQuestionIndex + 1 === totalQuestions
                        ? 'Finish Quiz & View Results'
                        : 'Next Question'}
                    </Text>
                    <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            /* QUIZ COMPLETED SUMMARY CARD */
            <View style={styles.resultCard}>
              <View style={styles.trophyWrapper}>
                <LinearGradient
                  colors={['#F59E0B', '#D97706']}
                  style={styles.trophyBadge}>
                  <Ionicons name="trophy" size={40} color="#FFFFFF" />
                </LinearGradient>
              </View>

              <Text style={styles.resultTitle}>
                {percentage >= 80
                  ? 'Outstanding Performance! 🌟'
                  : percentage >= 60
                  ? 'Great Effort! 👍'
                  : 'Keep Practicing! 📚'}
              </Text>
              <Text style={styles.resultSubtitle}>
                You scored {score} out of {totalQuestions} questions correctly.
              </Text>

              {/* SCORE STATS GRID */}
              <View style={styles.scoreGrid}>
                <View style={styles.scoreBox}>
                  <Text style={styles.scoreBoxValue}>{percentage}%</Text>
                  <Text style={styles.scoreBoxLabel}>Accuracy</Text>
                </View>
                <View style={styles.scoreBox}>
                  <Text style={[styles.scoreBoxValue, { color: '#10B981' }]}>
                    {score}/{totalQuestions}
                  </Text>
                  <Text style={styles.scoreBoxLabel}>Score</Text>
                </View>
                <View style={styles.scoreBox}>
                  <Text style={[styles.scoreBoxValue, { color: '#6366F1' }]}>
                    {percentage >= 80 ? 'Grade A+' : percentage >= 60 ? 'Grade B' : 'Grade C'}
                  </Text>
                  <Text style={styles.scoreBoxLabel}>Rating</Text>
                </View>
              </View>

              {/* ACTIONS */}
              <View style={styles.resultActions}>
                <TouchableOpacity
                  style={styles.retakeBtn}
                  onPress={() => {
                    setCurrentQuestionIndex(0);
                    setSelectedOption(null);
                    setIsAnswerSubmitted(false);
                    setScore(0);
                    setIsQuizCompleted(false);
                    setTimerSeconds(30);
                    setUserAnswers([]);
                  }}>
                  <Ionicons name="refresh" size={16} color="#4F46E5" />
                  <Text style={styles.retakeBtnText}>Retake Quiz</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.doneBtn}
                  onPress={() => {
                    onClose();
                    showAlert({
                      title: 'Quiz Result Saved 🎉',
                      message: `Your score of ${percentage}% in ${activeQuiz.title} has been logged in your academic profile.`,
                      type: 'success',
                      icon: 'checkmark-circle',
                    });
                  }}>
                  <Text style={styles.doneBtnText}>Save & Finish</Text>
                </TouchableOpacity>
              </View>

              {/* QUESTION-BY-QUESTION REVIEW SECTION */}
              <View style={styles.reviewSection}>
                <View style={styles.reviewSectionHeader}>
                  <Ionicons name="reader" size={18} color="#4F46E5" />
                  <Text style={styles.reviewSectionTitle}>Question-by-Question AI Review</Text>
                </View>

                {activeQuiz.questions.map((q, idx) => {
                  const ans = userAnswers[idx];
                  const isCorrect = ans === q.correctIndex;

                  return (
                    <View key={q.id} style={styles.reviewCard}>
                      <View style={styles.reviewCardTop}>
                        <View
                          style={[
                            styles.reviewBadge,
                            isCorrect ? styles.reviewBadgeCorrect : styles.reviewBadgeWrong,
                          ]}>
                          <Ionicons
                            name={isCorrect ? 'checkmark' : 'close'}
                            size={12}
                            color={isCorrect ? '#059669' : '#DC2626'}
                          />
                          <Text
                            style={[
                              styles.reviewBadgeText,
                              { color: isCorrect ? '#059669' : '#DC2626' },
                            ]}>
                            {isCorrect ? 'Correct' : 'Incorrect'}
                          </Text>
                        </View>
                        <Text style={styles.reviewQuestionNum}>Question {idx + 1}</Text>
                      </View>

                      <Text style={styles.reviewQuestionText}>{q.question}</Text>

                      <View style={styles.reviewAnswerRow}>
                        <Text style={styles.reviewAnswerLabel}>Your Answer:</Text>
                        <Text
                          style={[
                            styles.reviewAnswerVal,
                            { color: isCorrect ? '#059669' : '#DC2626' },
                          ]}>
                          {ans !== null && ans !== undefined
                            ? q.options[ans]
                            : 'No answer selected (Timed out)'}
                        </Text>
                      </View>

                      {!isCorrect && (
                        <View style={styles.reviewAnswerRow}>
                          <Text style={styles.reviewAnswerLabel}>Correct Answer:</Text>
                          <Text style={[styles.reviewAnswerVal, { color: '#059669' }]}>
                            {q.options[q.correctIndex]}
                          </Text>
                        </View>
                      )}

                      <View style={styles.reviewExplanationBox}>
                        <Ionicons name="bulb-outline" size={14} color="#D97706" />
                        <Text style={styles.reviewExplanationText}>{q.explanation}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerLeft: {
    flex: 1,
    paddingRight: 10,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  aiBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#4F46E5',
    letterSpacing: 0.5,
  },
  quizTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  quizSub: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quizSelectorBar: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingVertical: 8,
  },
  quizSelectorScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  quizSelectorPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  quizSelectorPillActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#C7D2FE',
  },
  quizSelectorText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  quizSelectorTextActive: {
    color: '#4F46E5',
    fontWeight: '800',
  },
  scrollArea: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  contentDesktop: {
    maxWidth: 720,
    width: '100%',
    alignSelf: 'center',
  },
  quizCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  progressTextCol: {
    flex: 1,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 6,
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4F46E5',
    borderRadius: 3,
  },
  timerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  timerPillUrgent: {
    backgroundColor: '#FEE2E2',
  },
  timerText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#4F46E5',
  },
  timerTextUrgent: {
    color: '#EF4444',
  },
  questionBox: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 24,
  },
  optionsList: {
    gap: 12,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 14,
  },
  optionItemSelected: {
    borderColor: '#4F46E5',
    backgroundColor: '#EEF2FF',
  },
  optionItemCorrect: {
    borderColor: '#10B981',
    backgroundColor: '#ECFDF5',
  },
  optionItemWrong: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  optionIndexPill: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionIndexLetter: {
    fontSize: 12,
    fontWeight: '800',
    color: '#475569',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
  },
  optionTextSelected: {
    color: '#4F46E5',
    fontWeight: '700',
  },
  optionTextCorrect: {
    color: '#065F46',
    fontWeight: '700',
  },
  optionTextWrong: {
    color: '#991B1B',
    fontWeight: '700',
  },
  explanationCard: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 14,
    padding: 14,
    marginTop: 18,
    gap: 6,
  },
  explanationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  explanationTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#92400E',
  },
  explanationBody: {
    fontSize: 13,
    lineHeight: 19,
    color: '#78350F',
  },
  nextBtn: {
    marginTop: 18,
    borderRadius: 14,
    overflow: 'hidden',
  },
  nextGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  nextBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  trophyWrapper: {
    marginBottom: 14,
  },
  trophyBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 4,
  },
  resultSubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
  },
  scoreGrid: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginBottom: 24,
  },
  scoreBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  scoreBoxValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },
  scoreBoxLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },
  resultActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  retakeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
  },
  retakeBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4F46E5',
  },
  doneBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#4F46E5',
  },
  doneBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // REVIEW SECTION
  reviewSection: {
    width: '100%',
    marginTop: 28,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 14,
  },
  reviewSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  reviewSectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  reviewCard: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 14,
    gap: 8,
  },
  reviewCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  reviewBadgeCorrect: {
    backgroundColor: '#ECFDF5',
  },
  reviewBadgeWrong: {
    backgroundColor: '#FEF2F2',
  },
  reviewBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  reviewQuestionNum: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  reviewQuestionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    lineHeight: 18,
  },
  reviewAnswerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  reviewAnswerLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    minWidth: 95,
  },
  reviewAnswerVal: {
    fontSize: 11,
    fontWeight: '700',
    flex: 1,
  },
  reviewExplanationBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 8,
    padding: 8,
    marginTop: 4,
  },
  reviewExplanationText: {
    fontSize: 11,
    color: '#92400E',
    lineHeight: 16,
    flex: 1,
  },
});
