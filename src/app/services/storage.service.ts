import { Injectable } from '@angular/core';
import { Post } from '../models/post.model';
import { User } from '../models/user.model';
import { Session } from '../models/session.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly POSTS_KEY = 'writespace_posts';
  private readonly USERS_KEY = 'writespace_users';
  private readonly SESSION_KEY = 'writespace_session';

  getPosts(): Post[] {
    try {
      const data = localStorage.getItem(this.POSTS_KEY);
      if (data) {
        return JSON.parse(data) as Post[];
      }
      return [];
    } catch {
      return [];
    }
  }

  savePosts(posts: Post[]): void {
    try {
      localStorage.setItem(this.POSTS_KEY, JSON.stringify(posts));
    } catch {
      // Silent fail — localStorage may be full or unavailable
    }
  }

  getUsers(): User[] {
    try {
      const data = localStorage.getItem(this.USERS_KEY);
      if (data) {
        return JSON.parse(data) as User[];
      }
      return [];
    } catch {
      return [];
    }
  }

  saveUsers(users: User[]): void {
    try {
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    } catch {
      // Silent fail — localStorage may be full or unavailable
    }
  }

  getSession(): Session | null {
    try {
      const data = localStorage.getItem(this.SESSION_KEY);
      if (data) {
        return JSON.parse(data) as Session;
      }
      return null;
    } catch {
      return null;
    }
  }

  saveSession(session: Session): void {
    try {
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    } catch {
      // Silent fail — localStorage may be full or unavailable
    }
  }

  clearSession(): void {
    try {
      localStorage.removeItem(this.SESSION_KEY);
    } catch {
      // Silent fail — localStorage may be unavailable
    }
  }

  seedDataIfNeeded(): void {
    const existingUsers = this.getUsers();
    if (existingUsers.length === 0) {
      const now = new Date().toISOString();

      const defaultUsers: User[] = [
        {
          id: 'user-admin-001',
          displayName: 'Admin',
          username: 'admin',
          password: 'admin123',
          role: 'admin',
          createdAt: now
        },
        {
          id: 'user-reader-001',
          displayName: 'Jane Reader',
          username: 'jane',
          password: 'jane123',
          role: 'user',
          createdAt: now
        }
      ];

      this.saveUsers(defaultUsers);
    }

    const existingPosts = this.getPosts();
    if (existingPosts.length === 0) {
      const samplePosts: Post[] = [
        {
          id: 'post-001',
          title: 'Getting Started with WriteSpace',
          content: 'Welcome to WriteSpace! This platform is designed to give you a clean, distraction-free writing experience. Whether you are a seasoned blogger or just starting out, WriteSpace provides all the tools you need to create, publish, and share your stories with the world. Explore the editor, customize your profile, and start writing today.',
          createdAt: new Date('2025-01-10T09:00:00Z').toISOString(),
          authorId: 'user-admin-001',
          authorName: 'Admin'
        },
        {
          id: 'post-002',
          title: 'The Art of Minimalist Writing',
          content: 'Minimalist writing is about stripping away the unnecessary and focusing on what truly matters. Every word should earn its place on the page. In this post, we explore techniques for writing with clarity and purpose. From eliminating filler words to structuring your thoughts before you write, minimalism can transform the way you communicate your ideas to readers.',
          createdAt: new Date('2025-01-12T14:30:00Z').toISOString(),
          authorId: 'user-admin-001',
          authorName: 'Admin'
        },
        {
          id: 'post-003',
          title: 'Building a Community Through Blogging',
          content: 'Blogging is more than just publishing articles — it is about building connections. A strong community forms when readers feel heard and valued. Engage with your audience through thoughtful content, respond to comments, and create a space where ideas can be exchanged freely. In this post, we discuss strategies for growing and nurturing your blogging community over time.',
          createdAt: new Date('2025-01-14T11:15:00Z').toISOString(),
          authorId: 'user-admin-001',
          authorName: 'Admin'
        }
      ];

      this.savePosts(samplePosts);
    }
  }
}