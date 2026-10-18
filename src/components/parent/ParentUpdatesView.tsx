import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppCard } from '@/components/common/AppCard';
import { StatusPill } from '@/components/common/StatusPill';
import { Palette, Radii } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { MOCK_COMMUNITY_POSTS } from '@/data/mockData';

export const ParentUpdatesView: React.FC = () => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;
  const { announcements } = useApp();

  const [activeTab, setActiveTab] = useState<'announcements' | 'community'>('announcements');
  const [posts, setPosts] = useState(MOCK_COMMUNITY_POSTS);

  const handleLike = (id: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p))
    );
  };

  return (
    <View style={styles.container}>
      {/* Header Tabs */}
      <View style={styles.tabBar}>
        <View style={styles.tabInner}>
          <TouchableOpacity
            onPress={() => setActiveTab('announcements')}
            style={[styles.tabButton, activeTab === 'announcements' && styles.tabButtonActive]}>
            <Ionicons
              name="megaphone-outline"
              size={16}
              color={activeTab === 'announcements' ? Palette.actionBlue : Palette.textSecondary}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === 'announcements' && styles.tabTextActive,
              ]}>
              Official Circulars
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('community')}
            style={[styles.tabButton, activeTab === 'community' && styles.tabButtonActive]}>
            <Ionicons
              name="people-outline"
              size={16}
              color={activeTab === 'community' ? Palette.actionBlue : Palette.textSecondary}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === 'community' && styles.tabTextActive,
              ]}>
              Class Community
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, isDesktop && styles.scrollContentDesktop]}
        showsVerticalScrollIndicator={false}>
        {/* TAB 1: OFFICIAL ANNOUNCEMENTS */}
        {activeTab === 'announcements' && (
          <View style={styles.listContainer}>
            <View style={styles.sectionHeadingRow}>
              <Text style={styles.sectionTitle}>School Circulars & Notices</Text>
              <Text style={styles.countTag}>{announcements.length} Total</Text>
            </View>

            <View style={[styles.annGrid, isDesktop && styles.annGridDesktop]}>
              {announcements.map((ann) => {
                const isEmergency = ann.priority === 'emergency';
                return (
                  <AppCard
                    key={ann.id}
                    style={[
                      styles.annCard,
                      isDesktop && styles.annCardDesktop,
                      isEmergency && styles.emergencyCard,
                    ]}>
                    <View style={styles.cardHeader}>
                      <View style={styles.priorityRow}>
                        <StatusPill status={ann.priority} size="sm" />
                        {ann.pinned && (
                          <View style={styles.pinnedBadge}>
                            <Ionicons name="pin" size={11} color={Palette.actionBlue} />
                            <Text style={styles.pinnedText}>Pinned</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.dateText}>{ann.date}</Text>
                    </View>

                    <Text
                      style={[
                        styles.annTitle,
                        isEmergency && { color: Palette.errorRed },
                      ]}>
                      {ann.title}
                    </Text>
                    <Text style={styles.annContent}>{ann.content}</Text>

                    <View style={styles.cardFooter}>
                      <Text style={styles.authorText}>Issued by: {ann.authorName}</Text>
                      <Text style={styles.audienceTag}>
                        Audience: {ann.audience.join(', ').toUpperCase()}
                      </Text>
                    </View>
                  </AppCard>
                );
              })}
            </View>
          </View>
        )}

        {/* TAB 2: CLASS COMMUNITY FEED */}
        {activeTab === 'community' && (
          <View style={styles.listContainer}>
            {/* Controlled community guidelines banner */}
            <View style={styles.guidelinesBanner}>
              <Ionicons name="shield-checkmark-outline" size={18} color={Palette.actionBlue} />
              <Text style={styles.guidelinesText}>
                Controlled Class Channel: Managed by Grade 8-A teachers. Respectful responses are moderated by school staff.
              </Text>
            </View>

            <View style={[styles.postGrid, isDesktop && styles.postGridDesktop]}>
              {posts.map((post) => (
                <AppCard
                  key={post.id}
                  style={[styles.postCard, isDesktop && styles.postCardDesktop]}>
                  <View style={styles.postHeader}>
                    <Image source={{ uri: post.teacherAvatar }} style={styles.postAvatar} />
                    <View style={styles.postAuthorCol}>
                      <Text style={styles.postAuthorName}>{post.teacherName}</Text>
                      <Text style={styles.postClassTag}>
                        {post.className} • {post.timestamp}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.postBody}>{post.content}</Text>

                  {/* Reaction bar */}
                  <View style={styles.postReactionsRow}>
                    <TouchableOpacity
                      style={styles.reactionBtn}
                      onPress={() => handleLike(post.id)}>
                      <Ionicons name="heart-outline" size={18} color={Palette.errorRed} />
                      <Text style={styles.reactionText}>{post.likes} Likes</Text>
                    </TouchableOpacity>

                    <View style={styles.reactionBtn}>
                      <Ionicons name="chatbubble-outline" size={16} color={Palette.actionBlue} />
                      <Text style={styles.reactionText}>{post.commentsCount} Replies</Text>
                    </View>
                  </View>
                </AppCard>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.background,
  },
  tabBar: {
    backgroundColor: Palette.surface,
    borderBottomWidth: 1,
    borderBottomColor: Palette.borderSubtle,
  },
  tabInner: {
    flexDirection: 'row',
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: Radii.sm,
    gap: 6,
  },
  tabButtonActive: {
    backgroundColor: Palette.blueTint,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: Palette.textSecondary,
  },
  tabTextActive: {
    color: Palette.actionBlue,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  scrollContentDesktop: {
    padding: 24,
  },
  listContainer: {
    gap: 14,
  },
  sectionHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Palette.textDark,
  },
  countTag: {
    fontSize: 12,
    fontWeight: '600',
    color: Palette.textSecondary,
    backgroundColor: Palette.borderSubtle,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radii.pill,
  },
  annGrid: {
    gap: 12,
  },
  annGridDesktop: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  annCard: {
    gap: 10,
  },
  annCardDesktop: {
    width: '48.5%',
  },
  emergencyCard: {
    borderColor: Palette.errorRed,
    borderWidth: 1.5,
    backgroundColor: '#FFF9F9',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priorityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pinnedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Palette.blueTint,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radii.xs,
  },
  pinnedText: {
    fontSize: 10,
    fontWeight: '700',
    color: Palette.actionBlue,
  },
  dateText: {
    fontSize: 12,
    color: Palette.textSecondary,
  },
  annTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Palette.textDark,
  },
  annContent: {
    fontSize: 13,
    color: Palette.textDark,
    lineHeight: 19,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Palette.borderSubtle,
    paddingTop: 8,
    marginTop: 4,
    flexWrap: 'wrap',
    gap: 6,
  },
  authorText: {
    fontSize: 12,
    color: Palette.textSecondary,
    fontWeight: '500',
  },
  audienceTag: {
    fontSize: 10,
    fontWeight: '700',
    color: Palette.actionBlue,
    letterSpacing: 0.5,
  },
  guidelinesBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.blueTint,
    padding: 12,
    borderRadius: Radii.md,
    gap: 10,
    borderWidth: 1,
    borderColor: '#D4E5FB',
  },
  guidelinesText: {
    fontSize: 12,
    color: Palette.primaryNavy,
    lineHeight: 16,
    flex: 1,
  },
  postGrid: {
    gap: 12,
  },
  postGridDesktop: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  postCard: {
    gap: 12,
  },
  postCardDesktop: {
    width: '48.5%',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  postAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Palette.border,
  },
  postAuthorCol: {
    gap: 2,
  },
  postAuthorName: {
    fontSize: 15,
    fontWeight: '700',
    color: Palette.textDark,
  },
  postClassTag: {
    fontSize: 12,
    color: Palette.textSecondary,
  },
  postBody: {
    fontSize: 14,
    color: Palette.textDark,
    lineHeight: 20,
  },
  postReactionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    borderTopWidth: 1,
    borderTopColor: Palette.borderSubtle,
    paddingTop: 10,
  },
  reactionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  reactionText: {
    fontSize: 13,
    fontWeight: '600',
    color: Palette.textSecondary,
  },
});
