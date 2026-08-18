"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface FavoritesContextType {
    favorites: string[]; // store product IDs
    toggleFavorite: (productId: string) => void;
    isFavorite: (productId: string) => boolean;
    isOpen: boolean;
    openFavorites: () => void;
    closeFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
    const [favorites, setFavorites] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const savedFavorites = localStorage.getItem("favorites");
        if (savedFavorites) {
            try {
                setFavorites(JSON.parse(savedFavorites));
            } catch (e) {
                console.error("Failed to parse favorites", e);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("favorites", JSON.stringify(favorites));
    }, [favorites]);

    const toggleFavorite = (productId: string) => {
        setFavorites(prev => {
            if (prev.includes(productId)) {
                return prev.filter(id => id !== productId);
            } else {
                return [...prev, productId];
            }
        });
    };

    const isFavorite = (productId: string) => {
        return favorites.includes(productId);
    };

    const openFavorites = () => setIsOpen(true);
    const closeFavorites = () => setIsOpen(false);

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, isOpen, openFavorites, closeFavorites }}>
            {children}
        </FavoritesContext.Provider>
    );
}

export function useFavorites() {
    const context = useContext(FavoritesContext);
    if (context === undefined) {
        throw new Error("useFavorites must be used within a FavoritesProvider");
    }
    return context;
}
