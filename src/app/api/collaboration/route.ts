import { NextRequest, NextResponse } from 'next/server';

// 협업 세션 데이터
interface CollaborationSession {
  id: string;
  users: CollaborativeUser[];
  content: string;
  versions: Version[];
  comments: Comment[];
  createdAt: Date;
  lastActivity: Date;
}

interface CollaborativeUser {
  id: string;
  name: string;
  color: string;
  cursor: number;
  isOnline: boolean;
  role: 'owner' | 'editor' | 'viewer';
  joinedAt: Date;
}

interface Version {
  id: string;
  content: string;
  timestamp: number;
  userId: string;
  description: string;
}

interface Comment {
  id: string;
  userId: string;
  content: string;
  position: number;
  timestamp: number;
  resolved: boolean;
}

// 메모리 기반 세션 저장소 (프로덕션에서는 Redis나 DB 사용)
const sessions = new Map<string, CollaborationSession>();

// 세션 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, userId, userName, userRole = 'editor' } = body;

    if (!sessionId || !userId || !userName) {
      return NextResponse.json(
        { error: 'sessionId, userId, userName are required' },
        { status: 400 }
      );
    }

    // 기존 세션 확인 또는 새 세션 생성
    let session = sessions.get(sessionId);
    
    if (!session) {
      session = {
        id: sessionId,
        users: [],
        content: '',
        versions: [],
        comments: [],
        createdAt: new Date(),
        lastActivity: new Date()
      };
      sessions.set(sessionId, session);
    }

    // 사용자 색상 할당
    const userColors = [
      '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
      '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
    ];

    // 기존 사용자 확인
    const existingUser = session.users.find(u => u.id === userId);
    
    if (existingUser) {
      // 기존 사용자 온라인 상태 업데이트
      existingUser.isOnline = true;
    } else {
      // 새 사용자 추가
      const newUser: CollaborativeUser = {
        id: userId,
        name: userName,
        color: userColors[session.users.length % userColors.length],
        cursor: 0,
        isOnline: true,
        role: session.users.length === 0 ? 'owner' : userRole,
        joinedAt: new Date()
      };
      session.users.push(newUser);
    }

    session.lastActivity = new Date();

    return NextResponse.json({
      success: true,
      session: {
        id: session.id,
        users: session.users,
        content: session.content,
        versions: session.versions,
        comments: session.comments
      }
    });

  } catch (error) {
    console.error('Collaboration session error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// 세션 정보 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'sessionId is required' },
        { status: 400 }
      );
    }

    const session = sessions.get(sessionId);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      session: {
        id: session.id,
        users: session.users,
        content: session.content,
        versions: session.versions,
        comments: session.comments
      }
    });

  } catch (error) {
    console.error('Get collaboration session error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// 세션 업데이트 (콘텐츠, 커서 위치 등)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, userId, action, data } = body;

    if (!sessionId || !userId || !action) {
      return NextResponse.json(
        { error: 'sessionId, userId, action are required' },
        { status: 400 }
      );
    }

    const session = sessions.get(sessionId);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    const user = session.users.find(u => u.id === userId);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found in session' },
        { status: 404 }
      );
    }

    // 액션에 따른 처리
    switch (action) {
      case 'updateContent':
        if (user.role !== 'viewer') {
          session.content = data.content;
        }
        break;

      case 'updateCursor':
        user.cursor = data.cursor;
        break;

      case 'addComment':
        if (user.role !== 'viewer') {
          const newComment: Comment = {
            id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            userId,
            content: data.content,
            position: data.position,
            timestamp: Date.now(),
            resolved: false
          };
          session.comments.push(newComment);
        }
        break;

      case 'addVersion':
        if (user.role === 'owner') {
          const newVersion: Version = {
            id: `v${session.versions.length + 1}`,
            content: session.content,
            timestamp: Date.now(),
            userId,
            description: data.description || `버전 ${session.versions.length + 1}`
          };
          session.versions.push(newVersion);
        }
        break;

      case 'restoreVersion':
        if (user.role !== 'viewer') {
          const version = session.versions.find(v => v.id === data.versionId);
          if (version) {
            session.content = version.content;
          }
        }
        break;

      case 'setOffline':
        user.isOnline = false;
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    session.lastActivity = new Date();

    return NextResponse.json({
      success: true,
      session: {
        id: session.id,
        users: session.users,
        content: session.content,
        versions: session.versions,
        comments: session.comments
      }
    });

  } catch (error) {
    console.error('Update collaboration session error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// 세션 정리 (비활성 세션 제거)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const userId = searchParams.get('userId');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'sessionId is required' },
        { status: 400 }
      );
    }

    const session = sessions.get(sessionId);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    if (userId) {
      // 특정 사용자를 세션에서 제거
      const userIndex = session.users.findIndex(u => u.id === userId);
      if (userIndex !== -1) {
        session.users[userIndex].isOnline = false;
      }
    } else {
      // 전체 세션 삭제
      sessions.delete(sessionId);
    }

    return NextResponse.json({
      success: true,
      message: userId ? 'User removed from session' : 'Session deleted'
    });

  } catch (error) {
    console.error('Delete collaboration session error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// 주기적으로 비활성 세션 정리 (24시간 이상 비활성)
setInterval(() => {
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  
  for (const [sessionId, session] of sessions.entries()) {
    if (session.lastActivity < oneDayAgo) {
      sessions.delete(sessionId);
      console.log(`Cleaned up inactive session: ${sessionId}`);
    }
  }
}, 60 * 60 * 1000); // 1시간마다 실행 