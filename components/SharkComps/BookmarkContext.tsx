import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {createContext, useContext, useEffect, useState} from "react";

export type SharkData = {
    title: string;
    image: any;
    route: string;
    basicFacts: string[];
    interestingFacts: string[];
    intenseFacts: string[];
};

type BookmarkContextType = {
    bookmarks: SharkData[];
    toggleBookmark: (shark: SharkData) => void;
};

const BookmarkContext = createContext<BookmarkContextType>({
    bookmarks: [],
    toggleBookmark: () => {},
});

export const useBookmarks = () => useContext(BookmarkContext);

export const BookmarkProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [bookmarks, setBookmarks] = useState<SharkData[]>([]);

    // Load bookmarks from AsyncStorage on mount
    useEffect(() => {
        (async () => {
            const stored = await AsyncStorage.getItem("@bookmarks");
            if (stored) setBookmarks(JSON.parse(stored));
        })();
    }, []);

    // Save bookmarks whenever they change
    useEffect(() => {
        AsyncStorage.setItem("@bookmarks", JSON.stringify(bookmarks));
    }, [bookmarks]);

    const toggleBookmark = (shark: SharkData) => {
        setBookmarks((prev) => {
            const exists = prev.some((b) => b.title === shark.title);
            if (exists) return prev.filter((b) => b.title !== shark.title);
            else return [...prev, shark];
        });
    };

    return <BookmarkContext.Provider value={{bookmarks, toggleBookmark}}>{children}</BookmarkContext.Provider>;
};
