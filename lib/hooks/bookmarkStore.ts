import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../models/ProductModel';

type BookmarkState = {
  bookmarks: Product[];
  addBookmark: (product: Product) => void;
  removeBookmark: (productId: string) => void;
};

export const bookmarkStore = create<BookmarkState>()(
  persist(
    (set) => ({
      bookmarks: [],
      addBookmark: (product) => set((state) => {
        const existing = state.bookmarks.find((p) => p._id === product._id);
        if (!existing) {
          return { bookmarks: [...state.bookmarks, product] };
        }
        return state;
      }),
      removeBookmark: (productId) => set((state) => ({
        bookmarks: state.bookmarks.filter((p) => p._id !== productId),
      })),
    }),
    {
      name: 'bookmarkStore',
    }
  )
);

export default function useBookmarkService() {
  const { bookmarks, addBookmark, removeBookmark } = bookmarkStore();
  return {
    bookmarks,
    addBookmark,
    removeBookmark,
  };
}
