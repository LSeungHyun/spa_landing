// Firebase 대신 더미 구현 (빌드 에러 방지)
// TODO: Supabase로 교체 예정

export interface AuthUser {
    uid: string;
    email: string | null;
    displayName: string | null;
}

export interface FirestoreDoc {
    id: string;
    data: () => any;
}

// 더미 auth 객체
export const auth = {
    currentUser: null as AuthUser | null,
    signInWithEmailAndPassword: async (email: string, password: string) => {
        console.log('Auth placeholder - will be replaced with Supabase');
        return { user: { uid: 'dummy', email, displayName: null } };
    },
    createUserWithEmailAndPassword: async (email: string, password: string) => {
        console.log('Auth placeholder - will be replaced with Supabase');
        return { user: { uid: 'dummy', email, displayName: null } };
    },
    signOut: async () => {
        console.log('SignOut placeholder - will be replaced with Supabase');
    }
};

// 더미 firestore 객체
export const db = {
    collection: (name: string) => ({
        add: async (data: any) => {
            console.log('Firestore placeholder - will be replaced with Supabase:', { collection: name, data });
            return { id: 'dummy-id' };
        },
        doc: (id: string) => ({
            get: async () => ({
                exists: true,
                id,
                data: () => ({ dummy: 'data' })
            }),
            set: async (data: any) => {
                console.log('Firestore set placeholder:', { collection: name, id, data });
            },
            update: async (data: any) => {
                console.log('Firestore update placeholder:', { collection: name, id, data });
            }
        })
    })
};

// Firestore 호환 함수들 (더미 구현)
export const collection = (db: any, name: string) => ({
    name,
    _db: db
});

export const addDoc = async (collectionRef: any, data: any) => {
    console.log('addDoc placeholder - will be replaced with Supabase:', {
        collection: collectionRef.name,
        data
    });
    return { id: 'dummy-doc-id' };
};

export const doc = (db: any, collection: string, id: string) => ({
    collection,
    id,
    _db: db
});

export const getDoc = async (docRef: any) => {
    console.log('getDoc placeholder:', docRef);
    return {
        exists: () => true,
        data: () => ({ dummy: 'data' }),
        id: docRef.id
    };
};

export const setDoc = async (docRef: any, data: any) => {
    console.log('setDoc placeholder:', { docRef, data });
};

export const updateDoc = async (docRef: any, data: any) => {
    console.log('updateDoc placeholder:', { docRef, data });
};

// Supabase 연동을 위한 준비 함수들
export const initSupabase = () => {
    console.log('Supabase initialization - to be implemented');
    // TODO: Supabase 클라이언트 초기화
};

export const supabaseAuth = {
    signUp: async (email: string, password: string) => {
        console.log('Supabase signUp - to be implemented');
        // TODO: Supabase auth 구현
    },
    signIn: async (email: string, password: string) => {
        console.log('Supabase signIn - to be implemented');
        // TODO: Supabase auth 구현
    },
    signOut: async () => {
        console.log('Supabase signOut - to be implemented');
        // TODO: Supabase auth 구현
    }
};

export const supabaseDb = {
    insert: async (table: string, data: any) => {
        console.log('Supabase insert - to be implemented:', { table, data });
        // TODO: Supabase 데이터 삽입 구현
        return { data: { id: 'dummy' }, error: null };
    },
    select: async (table: string, query?: any) => {
        console.log('Supabase select - to be implemented:', { table, query });
        // TODO: Supabase 데이터 조회 구현
        return { data: [], error: null };
    },
    update: async (table: string, id: string, data: any) => {
        console.log('Supabase update - to be implemented:', { table, id, data });
        // TODO: Supabase 데이터 업데이트 구현
        return { data: null, error: null };
    }
}; 