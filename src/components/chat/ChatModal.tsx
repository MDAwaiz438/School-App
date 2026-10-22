import React, { useState, useMemo } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '@/context/AppContext';
import { Radii } from '@/constants/theme';
import { ChatChannel, Role } from '@/types';

interface ChatModalProps {
  visible: boolean;
  onClose: () => void;
}

interface InstitutionContact {
  id: string;
  name: string;
  role: 'student' | 'teacher' | 'parent' | 'admin';
  roleLabel: string;
  subtitle: string;
  avatar: string;
}

const INSTITUTION_CONTACTS: InstitutionContact[] = [
  // Teachers
  {
    id: 'tch_jenkins',
    name: 'Mrs. Sarah Jenkins',
    role: 'teacher',
    roleLabel: 'Faculty Lead',
    subtitle: 'Grade 8-A Lead • Mathematics Faculty',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
  },
  {
    id: 'tch_reynolds',
    name: 'Mr. David Reynolds',
    role: 'teacher',
    roleLabel: 'Faculty',
    subtitle: 'Head of Science • Physics & Chemistry',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  },
  {
    id: 'tch_patel',
    name: 'Ms. Priya Patel',
    role: 'teacher',
    roleLabel: 'Faculty',
    subtitle: 'English Literature & Debate Coach',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
  },
  {
    id: 'tch_kumar',
    name: 'Coach Rajesh Kumar',
    role: 'teacher',
    roleLabel: 'Athletics',
    subtitle: 'Sports Director & Physical Education',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
  },
  // Students
  {
    id: 'std_aarav',
    name: 'Aarav Sharma',
    role: 'student',
    roleLabel: 'Student',
    subtitle: 'Roll #101 • Grade 8-A',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
  },
  {
    id: 'std_ananya',
    name: 'Ananya Sharma',
    role: 'student',
    roleLabel: 'Student',
    subtitle: 'Roll #102 • Grade 5-B',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
  },
  {
    id: 'std_rohan',
    name: 'Rohan Gupta',
    role: 'student',
    roleLabel: 'Student',
    subtitle: 'Roll #103 • Grade 8-A (Math Club)',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
  },
  {
    id: 'std_diya',
    name: 'Diya Patel',
    role: 'student',
    roleLabel: 'Student',
    subtitle: 'Roll #104 • Grade 8-A (Science Lead)',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  },
  // Parents
  {
    id: 'prt_vikram',
    name: 'Mr. Vikram Sharma',
    role: 'parent',
    roleLabel: 'Parent / Guardian',
    subtitle: 'Guardian of Aarav (8-A) & Ananya (5-B)',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
  },
  {
    id: 'prt_sunita',
    name: 'Mrs. Sunita Sharma',
    role: 'parent',
    roleLabel: 'PTA Committee',
    subtitle: 'Parent Association Executive Member',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
  },
  // Admins
  {
    id: 'adm_principal',
    name: 'Dr. Arthur Vance',
    role: 'admin',
    roleLabel: 'Principal',
    subtitle: 'Head of Institution • Executive Office',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
  },
  {
    id: 'adm_accounts',
    name: 'Finance & Accounts Desk',
    role: 'admin',
    roleLabel: 'Administration',
    subtitle: 'Tuition Fees, Fee Receipts & Invoices',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150',
  },
  {
    id: 'adm_transport',
    name: 'Transport & Campus Security',
    role: 'admin',
    roleLabel: 'Campus Ops',
    subtitle: 'School Bus Tracking & Security Desk',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
  },
];

const QUICK_PROMPTS = [
  'Could you explain problem #4?',
  'Worksheet submitted for review!',
  'Please check the medical leave slip.',
  'When is the next parent-teacher conference?',
  'Thank you for the update!',
];

const QUICK_EMOJIS = ['👍', '❤️', '👏', '💡', '❓', '🎯'];

export const ChatModal: React.FC<ChatModalProps> = ({ visible, onClose }) => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const {
    chatChannels,
    createChatChannel,
    chatMessages,
    sendChatMessage,
    activeChatChannelId,
    setActiveChatChannelId,
    role,
    showAlert,
  } = useApp();

  const [messageText, setMessageText] = useState('');
  const [showChannelListMobile, setShowChannelListMobile] = useState(false);
  const [channelFilter, setChannelFilter] = useState<'all' | 'direct' | 'group' | 'helpdesk'>('all');
  const [channelSearch, setChannelSearch] = useState('');

  // New Chat Modal States
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [newChatTab, setNewChatTab] = useState<'individual' | 'group'>('individual');
  const [contactRoleFilter, setContactRoleFilter] = useState<'all' | 'teacher' | 'student' | 'parent' | 'admin'>('all');
  const [contactSearch, setContactSearch] = useState('');

  // New Group States
  const [groupName, setGroupName] = useState('');
  const [groupSubtitle, setGroupSubtitle] = useState('');
  const [groupAudience, setGroupAudience] = useState<Role[]>(['student', 'teacher', 'parent', 'admin']);

  const activeChannel =
    chatChannels.find((c) => c.id === activeChatChannelId) || chatChannels[0];

  const currentChannelMessages = chatMessages.filter(
    (m) => m.channelId === (activeChannel ? activeChannel.id : '')
  );

  // Filter channels based on tab & search
  const filteredChannels = useMemo(() => {
    return chatChannels.filter((c) => {
      const matchesTab = channelFilter === 'all' || c.type === channelFilter;
      const matchesSearch =
        c.name.toLowerCase().includes(channelSearch.toLowerCase()) ||
        c.subtitle.toLowerCase().includes(channelSearch.toLowerCase()) ||
        c.lastMessage.toLowerCase().includes(channelSearch.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [chatChannels, channelFilter, channelSearch]);

  // Filter contacts in New Chat modal
  const filteredContacts = useMemo(() => {
    return INSTITUTION_CONTACTS.filter((c) => {
      const matchesRole = contactRoleFilter === 'all' || c.role === contactRoleFilter;
      const matchesSearch =
        c.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
        c.subtitle.toLowerCase().includes(contactSearch.toLowerCase()) ||
        c.roleLabel.toLowerCase().includes(contactSearch.toLowerCase());
      return matchesRole && matchesSearch;
    });
  }, [contactRoleFilter, contactSearch]);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || messageText;
    if (!text.trim() || !activeChannel) return;
    sendChatMessage(activeChannel.id, text.trim());
    setMessageText('');
  };

  const handleSelectChannel = (channel: ChatChannel) => {
    setActiveChatChannelId(channel.id);
    if (!isDesktop) {
      setShowChannelListMobile(false);
    }
  };

  const handleStartDirectChat = (contact: InstitutionContact) => {
    // Check if channel already exists
    const existing = chatChannels.find(
      (c) => c.name.toLowerCase().includes(contact.name.toLowerCase()) || c.id === `chn_${contact.id}`
    );

    if (existing) {
      setActiveChatChannelId(existing.id);
    } else {
      createChatChannel({
        name: contact.name,
        subtitle: `${contact.roleLabel} • ${contact.subtitle}`,
        avatar: contact.avatar,
        type: 'direct',
        allowedRoles: ['student', 'teacher', 'parent', 'admin'],
      });
    }

    setIsNewChatModalOpen(false);
    if (!isDesktop) {
      setShowChannelListMobile(false);
    }
  };

  const handleCreateGroup = () => {
    if (!groupName.trim()) {
      showAlert({
        title: 'Group Name Required',
        message: 'Please specify a name for the new group conversation.',
        type: 'warning',
      });
      return;
    }

    createChatChannel({
      name: groupName.trim(),
      subtitle: groupSubtitle.trim() || `Group discussion • ${groupAudience.length} role communities`,
      avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150',
      type: 'group',
      allowedRoles: groupAudience,
    });

    setGroupName('');
    setGroupSubtitle('');
    setIsNewChatModalOpen(false);
    if (!isDesktop) {
      setShowChannelListMobile(false);
    }
  };

  const toggleGroupAudience = (targetRole: Role) => {
    setGroupAudience((prev) =>
      prev.includes(targetRole) ? prev.filter((r) => r !== targetRole) : [...prev, targetRole]
    );
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        {/* ZOHO STYLE TOP BAR */}
        <View style={styles.topBar}>
          <View style={styles.topBarLeft}>
            {!isDesktop && (
              <TouchableOpacity
                onPress={() => setShowChannelListMobile(!showChannelListMobile)}
                style={styles.channelToggleBtn}>
                <Ionicons
                  name={showChannelListMobile ? 'chatbubble-ellipses' : 'menu'}
                  size={20}
                  color="#1E293B"
                />
              </TouchableOpacity>
            )}

            <View style={styles.headerInfo}>
              <View style={styles.activeAvatarWrapper}>
                {activeChannel?.avatar ? (
                  <Image source={{ uri: activeChannel.avatar }} style={styles.avatarImg} />
                ) : (
                  <View style={styles.avatarFallback}>
                    <Ionicons name="chatbubbles" size={18} color="#4F46E5" />
                  </View>
                )}
                <View style={styles.onlineDot} />
              </View>

              <View style={styles.headerTextCol}>
                <View style={styles.channelTitleRow}>
                  <Text style={styles.headerTitle} numberOfLines={1}>
                    {activeChannel?.name || 'Class Discussion'}
                  </Text>
                  <View
                    style={[
                      styles.channelTypePill,
                      activeChannel?.type === 'group'
                        ? styles.typePillGroup
                        : activeChannel?.type === 'helpdesk'
                        ? styles.typePillHelpdesk
                        : styles.typePillDirect,
                    ]}>
                    <Text style={styles.channelTypePillText}>
                      {activeChannel?.type === 'group'
                        ? 'GROUP'
                        : activeChannel?.type === 'helpdesk'
                        ? 'HELPDESK'
                        : 'DIRECT'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.headerSubtitle} numberOfLines={1}>
                  {activeChannel?.subtitle || 'Active Now'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.topBarRight}>
            <TouchableOpacity
              style={styles.newChatHeaderBtn}
              activeOpacity={0.8}
              onPress={() => setIsNewChatModalOpen(true)}>
              <Ionicons name="add" size={16} color="#FFFFFF" />
              <Text style={styles.newChatHeaderBtnText}>New Chat</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color="#475569" />
            </TouchableOpacity>
          </View>
        </View>

        {/* BODY (SIDEBAR + CHAT STREAM) */}
        <View style={styles.body}>
          {/* ZOHO CLIQ SIDEBAR */}
          {(isDesktop || showChannelListMobile) && (
            <View style={[styles.channelSidebar, !isDesktop && styles.channelSidebarMobile]}>
              {/* SIDEBAR HEADER */}
              <View style={styles.sidebarHeader}>
                <View>
                  <Text style={styles.sidebarBrand}>ZOHO CONNECT • CHAT</Text>
                  <Text style={styles.sidebarTitle}>Conversations</Text>
                </View>
                <TouchableOpacity
                  style={styles.newChatCircleBtn}
                  activeOpacity={0.8}
                  onPress={() => setIsNewChatModalOpen(true)}>
                  <Ionicons name="add" size={18} color="#4F46E5" />
                </TouchableOpacity>
              </View>

              {/* SEARCH INPUT */}
              <View style={styles.searchBox}>
                <Ionicons name="search" size={14} color="#94A3B8" />
                <TextInput
                  style={styles.searchInput}
                  value={channelSearch}
                  onChangeText={setChannelSearch}
                  placeholder="Search chats, contacts..."
                  placeholderTextColor="#94A3B8"
                />
                {channelSearch.length > 0 && (
                  <TouchableOpacity onPress={() => setChannelSearch('')}>
                    <Ionicons name="close-circle" size={14} color="#94A3B8" />
                  </TouchableOpacity>
                )}
              </View>

              {/* ZOHO CLIQ FILTER TABS */}
              <View style={styles.channelFilterRow}>
                {(['all', 'direct', 'group', 'helpdesk'] as const).map((tab) => {
                  const isActive = channelFilter === tab;
                  const label =
                    tab === 'all'
                      ? 'All'
                      : tab === 'direct'
                      ? 'Direct'
                      : tab === 'group'
                      ? 'Groups'
                      : 'Desk';

                  return (
                    <TouchableOpacity
                      key={tab}
                      style={[styles.filterTabBtn, isActive && styles.filterTabBtnActive]}
                      onPress={() => setChannelFilter(tab)}>
                      <Text
                        style={[
                          styles.filterTabBtnText,
                          isActive && styles.filterTabBtnTextActive,
                        ]}>
                        {label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* CHANNELS LIST */}
              <ScrollView style={styles.channelScroll} showsVerticalScrollIndicator={false}>
                {filteredChannels.length === 0 ? (
                  <View style={styles.emptyChannelsBox}>
                    <Ionicons name="chatbubbles-outline" size={28} color="#94A3B8" />
                    <Text style={styles.emptyChannelsText}>No conversations found</Text>
                  </View>
                ) : (
                  filteredChannels.map((channel) => {
                    const isActive = activeChannel?.id === channel.id;
                    const isGroup = channel.type === 'group';
                    const isHelpdesk = channel.type === 'helpdesk';

                    return (
                      <TouchableOpacity
                        key={channel.id}
                        style={[styles.channelCard, isActive && styles.channelCardActive]}
                        onPress={() => handleSelectChannel(channel)}
                        activeOpacity={0.8}>
                        <View style={styles.channelAvatarBox}>
                          {channel.avatar ? (
                            <Image
                              source={{ uri: channel.avatar }}
                              style={styles.channelAvatarImg}
                            />
                          ) : (
                            <View
                              style={[
                                styles.avatarFallbackMini,
                                isGroup && { backgroundColor: '#FDF2F8' },
                                isHelpdesk && { backgroundColor: '#F0FDF4' },
                              ]}>
                              <Ionicons
                                name={isGroup ? 'people' : isHelpdesk ? 'headset' : 'person'}
                                size={14}
                                color={isGroup ? '#DB2777' : isHelpdesk ? '#059669' : '#4F46E5'}
                              />
                            </View>
                          )}
                          <View style={styles.miniOnlineDot} />
                        </View>

                        <View style={styles.channelTextCol}>
                          <View style={styles.channelRowTop}>
                            <Text
                              style={[styles.channelName, isActive && styles.channelNameActive]}
                              numberOfLines={1}>
                              {channel.name}
                            </Text>
                            <Text style={styles.channelTime}>{channel.lastMessageTime}</Text>
                          </View>

                          <View style={styles.channelRowBottom}>
                            <Text style={styles.channelLastMsg} numberOfLines={1}>
                              {channel.lastMessage}
                            </Text>
                            {channel.unreadCount > 0 && !isActive && (
                              <View style={styles.unreadBadge}>
                                <Text style={styles.unreadBadgeText}>{channel.unreadCount}</Text>
                              </View>
                            )}
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  })
                )}
              </ScrollView>
            </View>
          )}

          {/* ACTIVE CHAT WORKSPACE */}
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.chatWorkspace}>
            {/* MESSAGES STREAM */}
            <ScrollView
              style={styles.messagesScroll}
              contentContainerStyle={styles.messagesContent}
              showsVerticalScrollIndicator={false}>
              {/* Encrypted Notice Banner */}
              <View style={styles.noticeBanner}>
                <Ionicons name="shield-checkmark" size={14} color="#059669" />
                <Text style={styles.noticeBannerText}>
                  Institutional Zoho Chat • End-to-End Encrypted (TLS 1.3)
                </Text>
              </View>

              {currentChannelMessages.map((msg) => {
                const isMine = msg.isSelf;
                const roleColor =
                  msg.senderRole === 'teacher'
                    ? '#4F46E5'
                    : msg.senderRole === 'student'
                    ? '#059669'
                    : msg.senderRole === 'parent'
                    ? '#D97706'
                    : '#7C3AED';

                return (
                  <View
                    key={msg.id}
                    style={[
                      styles.messageBubbleWrapper,
                      isMine ? styles.msgRight : styles.msgLeft,
                    ]}>
                    {!isMine && (
                      <View style={styles.senderHeader}>
                        <Text style={styles.senderName}>{msg.senderName}</Text>
                        <View style={[styles.roleTag, { borderColor: roleColor }]}>
                          <Text style={[styles.roleTagText, { color: roleColor }]}>
                            {msg.senderRole.toUpperCase()}
                          </Text>
                        </View>
                      </View>
                    )}

                    {isMine ? (
                      <LinearGradient
                        colors={['#4F46E5', '#6366F1']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.bubbleSelf}>
                        <Text style={styles.bubbleSelfText}>{msg.content}</Text>
                        <View style={styles.bubbleMeta}>
                          <Text style={styles.bubbleSelfTime}>{msg.timestamp}</Text>
                          <Ionicons name="checkmark-done" size={13} color="#CBD5E1" />
                        </View>
                      </LinearGradient>
                    ) : (
                      <View style={styles.bubbleOther}>
                        <Text style={styles.bubbleOtherText}>{msg.content}</Text>
                        <View style={styles.bubbleOtherMeta}>
                          <Text style={styles.bubbleOtherTime}>{msg.timestamp}</Text>
                          <Ionicons name="checkmark-done" size={12} color="#94A3B8" />
                        </View>
                      </View>
                    )}
                  </View>
                );
              })}
            </ScrollView>

            {/* QUICK EMOJI BAR */}
            <View style={styles.quickEmojiBar}>
              <Text style={styles.quickEmojiLabel}>Quick Reactions:</Text>
              <View style={styles.quickEmojiList}>
                {QUICK_EMOJIS.map((emoji) => (
                  <TouchableOpacity
                    key={emoji}
                    style={styles.emojiBtn}
                    onPress={() => handleSend(emoji)}>
                    <Text style={styles.emojiText}>{emoji}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* QUICK SUGGESTION PROMPTS */}
            <View style={styles.quickPromptsRow}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipsScroll}>
                {QUICK_PROMPTS.map((prompt, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.chipBtn}
                    onPress={() => handleSend(prompt)}
                    activeOpacity={0.7}>
                    <Text style={styles.chipText}>{prompt}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* INPUT COMPOSER */}
            <View style={styles.composerBar}>
              <TouchableOpacity
                style={styles.attachBtn}
                onPress={() =>
                  showAlert({
                    title: 'Attach Educational Material',
                    message:
                      'Select an assignment PDF, homework snapshot, medical certificate, or photo.',
                    type: 'info',
                    icon: 'attach-outline',
                  })
                }>
                <Ionicons name="attach" size={22} color="#64748B" />
              </TouchableOpacity>

              <TextInput
                style={styles.inputField}
                placeholder="Type a message or press return..."
                placeholderTextColor="#94A3B8"
                value={messageText}
                onChangeText={setMessageText}
                onSubmitEditing={() => handleSend()}
                returnKeyType="send"
              />

              <TouchableOpacity
                style={[styles.sendBtn, !messageText.trim() && styles.sendBtnDisabled]}
                onPress={() => handleSend()}
                disabled={!messageText.trim()}
                activeOpacity={0.8}>
                <Ionicons name="send" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>

        {/* MODAL: START NEW CHAT / GROUP (Zoho Cliq Style) */}
        <Modal
          visible={isNewChatModalOpen}
          animationType="slide"
          transparent
          onRequestClose={() => setIsNewChatModalOpen(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalSheet}>
              {/* MODAL HEADER */}
              <View style={styles.modalHeader}>
                <View>
                  <Text style={styles.modalTag}>ZOHO CHAT DIRECTORY</Text>
                  <Text style={styles.modalTitle}>Start New Conversation</Text>
                </View>
                <TouchableOpacity
                  onPress={() => setIsNewChatModalOpen(false)}
                  style={styles.modalCloseCircle}>
                  <Ionicons name="close" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              {/* TABS: INDIVIDUAL (1:1) vs GROUP CHANNEL */}
              <View style={styles.newChatTabsRow}>
                <TouchableOpacity
                  style={[
                    styles.newChatTabBtn,
                    newChatTab === 'individual' && styles.newChatTabBtnActive,
                  ]}
                  onPress={() => setNewChatTab('individual')}>
                  <Ionicons
                    name="person"
                    size={15}
                    color={newChatTab === 'individual' ? '#4F46E5' : '#64748B'}
                  />
                  <Text
                    style={[
                      styles.newChatTabBtnText,
                      newChatTab === 'individual' && styles.newChatTabBtnTextActive,
                    ]}>
                    Direct 1:1 Contact
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.newChatTabBtn,
                    newChatTab === 'group' && styles.newChatTabBtnActive,
                  ]}
                  onPress={() => setNewChatTab('group')}>
                  <Ionicons
                    name="people"
                    size={15}
                    color={newChatTab === 'group' ? '#4F46E5' : '#64748B'}
                  />
                  <Text
                    style={[
                      styles.newChatTabBtnText,
                      newChatTab === 'group' && styles.newChatTabBtnTextActive,
                    ]}>
                    New Group Channel
                  </Text>
                </TouchableOpacity>
              </View>

              {/* TAB 1: INDIVIDUAL CONTACTS */}
              {newChatTab === 'individual' && (
                <View style={{ flex: 1 }}>
                  {/* CONTACT ROLE FILTERS */}
                  <View style={styles.contactFiltersScroll}>
                    {(['all', 'teacher', 'student', 'parent', 'admin'] as const).map((r) => {
                      const isActive = contactRoleFilter === r;
                      const label =
                        r === 'all'
                          ? 'All Members'
                          : r === 'teacher'
                          ? 'Teachers'
                          : r === 'student'
                          ? 'Students'
                          : r === 'parent'
                          ? 'Parents'
                          : 'Admins';

                      return (
                        <TouchableOpacity
                          key={r}
                          style={[
                            styles.contactFilterPill,
                            isActive && styles.contactFilterPillActive,
                          ]}
                          onPress={() => setContactRoleFilter(r)}>
                          <Text
                            style={[
                              styles.contactFilterPillText,
                              isActive && styles.contactFilterPillTextActive,
                            ]}>
                            {label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {/* CONTACT SEARCH */}
                  <View style={styles.contactSearchBox}>
                    <Ionicons name="search" size={15} color="#94A3B8" />
                    <TextInput
                      style={styles.contactSearchInput}
                      value={contactSearch}
                      onChangeText={setContactSearch}
                      placeholder="Search member by name, role or grade..."
                      placeholderTextColor="#94A3B8"
                    />
                  </View>

                  {/* CONTACTS LIST */}
                  <ScrollView style={styles.contactsList} showsVerticalScrollIndicator={false}>
                    {filteredContacts.map((contact) => (
                      <TouchableOpacity
                        key={contact.id}
                        style={styles.contactCard}
                        onPress={() => handleStartDirectChat(contact)}
                        activeOpacity={0.75}>
                        <Image source={{ uri: contact.avatar }} style={styles.contactAvatar} />
                        <View style={styles.contactInfoCol}>
                          <View style={styles.contactNameRow}>
                            <Text style={styles.contactName}>{contact.name}</Text>
                            <View
                              style={[
                                styles.contactRolePill,
                                contact.role === 'teacher'
                                  ? styles.rolePillTeacher
                                  : contact.role === 'student'
                                  ? styles.rolePillStudent
                                  : contact.role === 'parent'
                                  ? styles.rolePillParent
                                  : styles.rolePillAdmin,
                              ]}>
                              <Text style={styles.contactRolePillText}>
                                {contact.roleLabel.toUpperCase()}
                              </Text>
                            </View>
                          </View>
                          <Text style={styles.contactSub}>{contact.subtitle}</Text>
                        </View>
                        <Ionicons name="chatbubble-ellipses-outline" size={18} color="#4F46E5" />
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* TAB 2: CREATE GROUP CHANNEL */}
              {newChatTab === 'group' && (
                <ScrollView
                  style={{ flex: 1 }}
                  contentContainerStyle={styles.newGroupForm}
                  showsVerticalScrollIndicator={false}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Group Channel Name *</Text>
                    <TextInput
                      style={styles.modalTextInput}
                      value={groupName}
                      onChangeText={setGroupName}
                      placeholder="e.g. Science Olympiad 2026, Grade 8-A Project"
                      placeholderTextColor="#94A3B8"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Channel Purpose / Subtitle</Text>
                    <TextInput
                      style={styles.modalTextInput}
                      value={groupSubtitle}
                      onChangeText={setGroupSubtitle}
                      placeholder="e.g. Collaboration on lab worksheets and submissions"
                      placeholderTextColor="#94A3B8"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Member Communities (Audience)</Text>
                    <View style={styles.audiencePillsRow}>
                      {(['student', 'teacher', 'parent', 'admin'] as const).map((r) => {
                        const isSelected = groupAudience.includes(r);
                        return (
                          <TouchableOpacity
                            key={r}
                            style={[
                              styles.audiencePill,
                              isSelected && styles.audiencePillActive,
                            ]}
                            onPress={() => toggleGroupAudience(r)}>
                            <Ionicons
                              name={isSelected ? 'checkmark-circle' : 'ellipse-outline'}
                              size={14}
                              color={isSelected ? '#4F46E5' : '#64748B'}
                            />
                            <Text
                              style={[
                                styles.audiencePillText,
                                isSelected && styles.audiencePillTextActive,
                              ]}>
                              {r.toUpperCase()}S
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.createGroupBtn}
                    activeOpacity={0.85}
                    onPress={handleCreateGroup}>
                    <Ionicons name="people" size={18} color="#FFFFFF" />
                    <Text style={styles.createGroupBtnText}>Create & Launch Group Channel</Text>
                  </TouchableOpacity>
                </ScrollView>
              )}
            </View>
          </View>
        </Modal>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    gap: 12,
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    minWidth: 0,
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  newChatHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#4F46E5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  newChatHeaderBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  channelToggleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    minWidth: 0,
  },
  headerTextCol: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
  },
  channelTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  channelTypePill: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  typePillGroup: {
    backgroundColor: '#FDF2F8',
  },
  typePillHelpdesk: {
    backgroundColor: '#F0FDF4',
  },
  typePillDirect: {
    backgroundColor: '#EEF2FF',
  },
  channelTypePillText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#475569',
  },
  activeAvatarWrapper: {
    position: 'relative',
    flexShrink: 0,
  },
  avatarImg: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarFallback: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  miniOnlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#10B981',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  body: {
    flex: 1,
    flexDirection: 'row',
  },
  channelSidebar: {
    width: 300,
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1,
    borderRightColor: '#E2E8F0',
  },
  channelSidebarMobile: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '85%',
    zIndex: 99,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  sidebarBrand: {
    fontSize: 9,
    fontWeight: '800',
    color: '#4F46E5',
    letterSpacing: 0.8,
  },
  sidebarTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  newChatCircleBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    marginHorizontal: 14,
    marginVertical: 6,
    paddingHorizontal: 10,
    height: 36,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: '#0F172A',
  },
  channelFilterRow: {
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  filterTabBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: '#F8FAFC',
  },
  filterTabBtnActive: {
    backgroundColor: '#EEF2FF',
  },
  filterTabBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  filterTabBtnTextActive: {
    color: '#4F46E5',
    fontWeight: '800',
  },
  channelScroll: {
    flex: 1,
  },
  emptyChannelsBox: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyChannelsText: {
    fontSize: 12,
    color: '#94A3B8',
  },
  channelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
    gap: 10,
  },
  channelCardActive: {
    backgroundColor: '#EEF2FF',
  },
  channelAvatarBox: {
    position: 'relative',
    width: 38,
    height: 38,
    borderRadius: 19,
    flexShrink: 0,
  },
  channelAvatarImg: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  avatarFallbackMini: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  channelTextCol: {
    flex: 1,
    minWidth: 0,
  },
  channelRowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  channelName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    flex: 1,
  },
  channelNameActive: {
    color: '#4F46E5',
    fontWeight: '800',
  },
  channelTime: {
    fontSize: 10,
    color: '#94A3B8',
    marginLeft: 6,
  },
  channelRowBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  channelLastMsg: {
    fontSize: 11,
    color: '#64748B',
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: '#4F46E5',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 6,
  },
  unreadBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  chatWorkspace: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  messagesScroll: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  noticeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: Radii.sm,
    alignSelf: 'center',
    marginBottom: 8,
  },
  noticeBannerText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#065F46',
  },
  messageBubbleWrapper: {
    maxWidth: '82%',
  },
  msgRight: {
    alignSelf: 'flex-end',
  },
  msgLeft: {
    alignSelf: 'flex-start',
  },
  senderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
    marginLeft: 4,
  },
  senderName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  roleTag: {
    borderWidth: 1,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  roleTagText: {
    fontSize: 9,
    fontWeight: '800',
  },
  bubbleSelf: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    borderBottomRightRadius: 4,
  },
  bubbleSelfText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
    lineHeight: 20,
  },
  bubbleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    marginTop: 4,
  },
  bubbleSelfTime: {
    fontSize: 10,
    color: '#E0E7FF',
  },
  bubbleOther: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  bubbleOtherText: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '500',
    lineHeight: 20,
  },
  bubbleOtherMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    marginTop: 4,
  },
  bubbleOtherTime: {
    fontSize: 10,
    color: '#94A3B8',
  },
  quickEmojiBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 10,
  },
  quickEmojiLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
  },
  quickEmojiList: {
    flexDirection: 'row',
    gap: 8,
  },
  emojiBtn: {
    padding: 3,
  },
  emojiText: {
    fontSize: 16,
  },
  quickPromptsRow: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  chipsScroll: {
    paddingHorizontal: 12,
    gap: 8,
  },
  chipBtn: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  composerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 8,
  },
  attachBtn: {
    padding: 6,
  },
  inputField: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 14,
    color: '#0F172A',
    maxHeight: 100,
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: '#CBD5E1',
  },

  // NEW CHAT MODAL STYLES
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalTag: {
    fontSize: 10,
    fontWeight: '800',
    color: '#4F46E5',
    letterSpacing: 0.8,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  modalCloseCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  newChatTabsRow: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 12,
  },
  newChatTabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
  },
  newChatTabBtnActive: {
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  newChatTabBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  newChatTabBtnTextActive: {
    color: '#4F46E5',
    fontWeight: '800',
  },
  contactFiltersScroll: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  contactFilterPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
  },
  contactFilterPillActive: {
    backgroundColor: '#4F46E5',
  },
  contactFilterPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  contactFilterPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  contactSearchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 38,
    gap: 8,
    marginBottom: 10,
  },
  contactSearchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
  },
  contactsList: {
    maxHeight: 340,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 12,
  },
  contactAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  contactInfoCol: {
    flex: 1,
  },
  contactNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  contactName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  contactRolePill: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  rolePillTeacher: {
    backgroundColor: '#EEF2FF',
  },
  rolePillStudent: {
    backgroundColor: '#ECFDF5',
  },
  rolePillParent: {
    backgroundColor: '#FEF3C7',
  },
  rolePillAdmin: {
    backgroundColor: '#F3E8FF',
  },
  contactRolePillText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#475569',
  },
  contactSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },

  // NEW GROUP FORM
  newGroupForm: {
    paddingTop: 8,
    gap: 14,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
  },
  modalTextInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    color: '#0F172A',
  },
  audiencePillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  audiencePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  audiencePillActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#4F46E5',
  },
  audiencePillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  audiencePillTextActive: {
    color: '#4F46E5',
    fontWeight: '800',
  },
  createGroupBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 8,
    marginBottom: 20,
  },
  createGroupBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
