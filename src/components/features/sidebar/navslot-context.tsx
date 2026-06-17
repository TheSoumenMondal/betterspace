"use client";

import type * as React from "react";
import { createContext, useContext, useEffect, useRef, useState } from "react";

interface NavSlotContextValue {
	navSlot: React.ReactNode;
	setNavSlot: (slot: React.ReactNode) => void;
	actionSlot: React.ReactNode;
	setActionSlot: (slot: React.ReactNode) => void;
}

const NavSlotContext = createContext<NavSlotContextValue>({
	navSlot: null,
	setNavSlot: () => {},
	actionSlot: null,
	setActionSlot: () => {},
});

export function NavSlotProvider({ children }: { children: React.ReactNode }) {
	const [navSlot, setNavSlot] = useState<React.ReactNode>(null);
	const [actionSlot, setActionSlot] = useState<React.ReactNode>(null);

	return (
		<NavSlotContext.Provider
			value={{ navSlot, setNavSlot, actionSlot, setActionSlot }}
		>
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

export function ActionSlot({ children }: { children: React.ReactNode }) {
	const { setActionSlot } = useNavSlot();

	const childrenRef = useRef(children);
	childrenRef.current = children;

	useEffect(() => {
		setActionSlot(childrenRef.current);
		return () => setActionSlot(null);
	}, [setActionSlot]);

	useEffect(() => {
		setActionSlot(children);
	}, [children, setActionSlot]);

	return null;
}
