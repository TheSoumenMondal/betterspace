"use client";

import type * as React from "react";
import { createContext, useContext, useEffect, useRef, useState } from "react";

interface NavSlotContextValue {
	navSlot: React.ReactNode;
	setNavSlot: (slot: React.ReactNode) => void;
}

const NavSlotContext = createContext<NavSlotContextValue>({
	navSlot: null,
	setNavSlot: () => {},
});

export function NavSlotProvider({ children }: { children: React.ReactNode }) {
	const [navSlot, setNavSlot] = useState<React.ReactNode>(null);

	return (
		<NavSlotContext.Provider value={{ navSlot, setNavSlot }}>
			{children}
		</NavSlotContext.Provider>
	);
}

export function useNavSlot() {
	return useContext(NavSlotContext);
}

export function NavSlot({ children }: { children: React.ReactNode }) {
	const { setNavSlot } = useNavSlot();

	const childrenRef = useRef(children);
	childrenRef.current = children;

	useEffect(() => {
		setNavSlot(childrenRef.current);
		return () => setNavSlot(null);
	}, [setNavSlot]);

	useEffect(() => {
		setNavSlot(children);
	}, [children, setNavSlot]);

	return null;
}
