"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { 
  Users, 
  Share2, 
  History, 
  MessageCircle, 
  Eye,
  Edit3,
  Crown,
  Wifi,
  WifiOff
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// 사용자 타입 정의
interface CollaborativeUser {
  id: string;
  name: string;
  color: string;
  cursor: number;
  isOnline: boolean;
  role: 'owner' | 'editor' | 'viewer';
  avatar?: string;
}

// 편집 이벤트 타입
interface EditEvent {
  id: string;
  userId: string;
  type: 'insert' | 'delete' | 'cursor';
  position: number;
  content?: string;
  length?: number;
  timestamp: number;
}

// 댓글 타입
interface Comment {
  id: string;
  userId: string;
  content: string;
  position: number;
  timestamp: number;
  resolved: boolean;
}

// 버전 히스토리 타입
interface Version {
  id: string;
  content: string;
  timestamp: number;
  userId: string;
  description: string;
}

interface CollaborativeEditorProps {
  sessionId?: string;
  initialContent?: string;
  userRole?: 'owner' | 'editor' | 'viewer';
  onContentChange?: (content: string) => void;
  className?: string;
}

export function CollaborativeEditor({
  sessionId = 'demo-session',
  initialContent = '',
  userRole = 'editor',
  onContentChange,
  className
}: CollaborativeEditorProps) {
  // 상태 관리
  const [content, setContent] = useState(initialContent);
  const [users, setUsers] = useState<CollaborativeUser[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [versions, setVersions] = useState<Version[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // 색상 팔레트
  const userColors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
  ];

  // 현재 사용자 정보
  const currentUser: CollaborativeUser = {
    id: 'current-user',
    name: '나',
    color: userColors[0],
    cursor: cursorPosition,
    isOnline: true,
    role: userRole
  };

  // WebSocket 연결 설정
  useEffect(() => {
    // 데모용 가상 사용자들 추가
    const demoUsers: CollaborativeUser[] = [
      {
        id: 'user-1',
        name: '김개발',
        color: userColors[1],
        cursor: 45,
        isOnline: true,
        role: 'editor'
      },
      {
        id: 'user-2',
        name: '박기획',
        color: userColors[2],
        cursor: 120,
        isOnline: true,
        role: 'viewer'
      },
      {
        id: 'user-3',
        name: '이디자인',
        color: userColors[3],
        cursor: 0,
        isOnline: false,
        role: 'editor'
      }
    ];

    setUsers([currentUser, ...demoUsers]);
    setIsConnected(true);

    // 가상 버전 히스토리 생성
    const demoVersions: Version[] = [
      {
        id: 'v1',
        content: '제품 기획서를 작성해주세요',
        timestamp: Date.now() - 3600000,
        userId: 'user-1',
        description: '초기 버전'
      },
      {
        id: 'v2',
        content: '새로운 AI 기반 제품 기획서를 작성해주세요. 사용자 경험을 중심으로 설명해주세요.',
        timestamp: Date.now() - 1800000,
        userId: 'user-2',
        description: '상세 요구사항 추가'
      }
    ];

    setVersions(demoVersions);

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [sessionId]);

  // 콘텐츠 변경 처리
  const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    onContentChange?.(newContent);

    // 커서 위치 업데이트
    const cursor = e.target.selectionStart;
    setCursorPosition(cursor);

    // 실시간 동기화 시뮬레이션
    toast.success('변경사항이 동기화되었습니다', { duration: 1000 });
  }, [onContentChange]);

  // 댓글 추가
  const addComment = useCallback(() => {
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      userId: currentUser.id,
      content: '이 부분을 더 구체적으로 설명해주세요.',
      position: cursorPosition,
      timestamp: Date.now(),
      resolved: false
    };

    setComments(prev => [...prev, newComment]);
    toast.success('댓글이 추가되었습니다');
  }, [cursorPosition, currentUser.id]);

  // 버전 저장
  const saveVersion = useCallback(() => {
    const newVersion: Version = {
      id: `v${versions.length + 1}`,
      content,
      timestamp: Date.now(),
      userId: currentUser.id,
      description: `버전 ${versions.length + 1}`
    };

    setVersions(prev => [...prev, newVersion]);
    toast.success('새 버전이 저장되었습니다');
  }, [content, versions.length, currentUser.id]);

  // 버전 복원
  const restoreVersion = useCallback((version: Version) => {
    setContent(version.content);
    onContentChange?.(version.content);
    toast.success(`${version.description}으로 복원되었습니다`);
  }, [onContentChange]);

  // 사용자 커서 표시 컴포넌트
  const UserCursor = ({ user }: { user: CollaborativeUser }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: user.isOnline ? 1 : 0.3 }}
      className="absolute pointer-events-none"
      style={{
        left: `${Math.min(user.cursor * 0.5, 90)}%`,
        top: `${Math.floor(user.cursor / 50) * 24 + 8}px`
      }}
    >
      <div 
        className="w-0.5 h-6 animate-pulse"
        style={{ backgroundColor: user.color }}
      />
      <div 
        className="absolute -top-6 left-0 px-2 py-1 text-xs text-white rounded whitespace-nowrap"
        style={{ backgroundColor: user.color }}
      >
        {user.name}
      </div>
    </motion.div>
  );

  return (
    <div className={cn("space-y-4", className)}>
      {/* 헤더 - 사용자 및 연결 상태 */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Edit3 className="w-5 h-5" />
              실시간 협업 편집기
              <Badge variant={isConnected ? "default" : "secondary"}>
                {isConnected ? (
                  <>
                    <Wifi className="w-3 h-3 mr-1" />
                    연결됨
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3 h-3 mr-1" />
                    연결 끊김
                  </>
                )}
              </Badge>
            </CardTitle>
            
            <div className="flex items-center gap-2">
              {/* 온라인 사용자 표시 */}
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {users.filter(u => u.isOnline).length}명 온라인
                </span>
              </div>
              
              {/* 사용자 아바타 */}
              <div className="flex -space-x-2">
                {users.slice(0, 4).map((user) => (
                  <div key={user.id} className="relative">
                    <Avatar 
                      className={cn(
                        "w-8 h-8 border-2 border-white",
                        !user.isOnline && "opacity-50"
                      )}
                      style={{ borderColor: user.color }}
                    >
                      <div 
                        className="w-full h-full rounded-full flex items-center justify-center text-white text-xs font-medium"
                        style={{ backgroundColor: user.color }}
                      >
                        {user.name[0]}
                      </div>
                    </Avatar>
                    {user.role === 'owner' && (
                      <Crown className="w-3 h-3 absolute -top-1 -right-1 text-yellow-500" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* 메인 편집기 */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            {/* 사용자 커서들 */}
            {users.filter(u => u.id !== currentUser.id && u.isOnline).map((user) => (
              <UserCursor key={user.id} user={user} />
            ))}
            
            {/* 텍스트 에디터 */}
            <Textarea
              ref={textareaRef}
              value={content}
              onChange={handleContentChange}
              placeholder="프롬프트를 입력하고 실시간으로 협업하세요..."
              className="min-h-[300px] resize-none"
              disabled={userRole === 'viewer'}
            />
            
            {/* 권한 표시 */}
            {userRole === 'viewer' && (
              <div className="absolute inset-0 bg-gray-500/10 flex items-center justify-center rounded-md">
                <Badge variant="secondary">
                  <Eye className="w-3 h-3 mr-1" />
                  읽기 전용
                </Badge>
              </div>
            )}
          </div>
          
          {/* 액션 버튼들 */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowComments(!showComments)}
              >
                <MessageCircle className="w-4 h-4 mr-1" />
                댓글 ({comments.length})
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowHistory(!showHistory)}
              >
                <History className="w-4 h-4 mr-1" />
                히스토리 ({versions.length})
              </Button>
              
              {userRole !== 'viewer' && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={addComment}
                >
                  <MessageCircle className="w-4 h-4 mr-1" />
                  댓글 추가
                </Button>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {userRole === 'owner' && (
                <Button size="sm" onClick={saveVersion}>
                  버전 저장
                </Button>
              )}
              
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-1" />
                공유
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 댓글 패널 */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">댓글</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {comments.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      아직 댓글이 없습니다.
                    </p>
                  ) : (
                    comments.map((comment) => {
                      const user = users.find(u => u.id === comment.userId);
                      return (
                        <div key={comment.id} className="flex gap-3 p-3 bg-muted/50 rounded-lg">
                          <Avatar className="w-8 h-8">
                            <div 
                              className="w-full h-full rounded-full flex items-center justify-center text-white text-xs font-medium"
                              style={{ backgroundColor: user?.color || '#666' }}
                            >
                              {user?.name[0] || 'U'}
                            </div>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">{user?.name || '알 수 없음'}</span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(comment.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                            <p className="text-sm">{comment.content}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 버전 히스토리 패널 */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">버전 히스토리</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {versions.map((version) => {
                    const user = users.find(u => u.id === version.userId);
                    return (
                      <div key={version.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{version.description}</span>
                            <Badge variant="outline" className="text-xs">
                              {user?.name || '알 수 없음'}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {new Date(version.timestamp).toLocaleString()}
                          </p>
                          <p className="text-sm mt-1 truncate max-w-md">
                            {version.content}
                          </p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => restoreVersion(version)}
                          disabled={userRole === 'viewer'}
                        >
                          복원
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CollaborativeEditor; 