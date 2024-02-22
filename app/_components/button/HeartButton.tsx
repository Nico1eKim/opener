"use client";

import confetti from "canvas-confetti";
import { useRouter } from "next/navigation";
import { MouseEvent, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import useGetWindowWidth from "@/hooks/useGetWindowWidth";
import { getSession } from "@/store/session/cookies";
import HeartIcon from "./HeartIcon";

interface Props {
  isSmall?: boolean;
  isSelected?: boolean;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

const HeartButton = ({ isSmall = false, isSelected = false, onClick, ...props }: Props) => {
  const session = getSession();
  const route = useRouter();
  const [selected, setSelected] = useState(isSelected);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setSelected(isSelected);
  }, [isSelected]);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (!session) {
      toast("로그인하고 좋아하는 행사를 저장해보세요!", { className: "text-16 font-600" });
      route.push("/signin");
      return;
    }
    setSelected((prev) => !prev);
    onClick?.(event);

    const rect = buttonRef.current?.getBoundingClientRect();
    const { innerWidth, innerHeight } = window;
    if (rect && selected === true) {
      confetti({
        particleCount: 1,
        scalar: 3,
        spread: 50,
        startVelocity: 10,
        shapes: [heart],
        colors: ["#EB278C", "#ff008480", "#e11e831f"],
        origin: { x: (rect.left + rect.right) / 2 / innerWidth, y: (rect.top + rect.bottom) / 2 / innerHeight },
      });
    }
  };

  const { isPc } = useGetWindowWidth();

  return (
    <div className="flex-center z-heart h-32 w-32">
      <button ref={isPc ? null : buttonRef} className="w-fit pc:hidden" onClick={handleClick} aria-label="이 행사를 마이페이지에 저장/삭제" {...props}>
        <HeartIcon
          width={isSmall ? "24" : "28"}
          height={isSmall ? "24" : "28"}
          viewBox="0 0 24 24"
          stroke={selected ? "#FF50AA" : isSmall ? "#A0A5B1" : "white"}
          fill={selected ? "#FF50AA" : "none"}
          isSelected={selected ? true : false}
        />
      </button>
      <button ref={isPc ? buttonRef : null} className="hidden w-fit pc:inline" onClick={handleClick} aria-label="이 행사를 마이페이지에 저장/삭제" {...props}>
        <HeartIcon
          width={isSmall ? "24" : "32"}
          height={isSmall ? "24" : "32"}
          viewBox="0 0 24 24"
          stroke={selected ? "#FF50AA" : isSmall ? "#A0A5B1" : "white"}
          fill={selected ? "#FF50AA" : "none"}
          isSelected={selected ? true : false}
        />
      </button>
    </div>
  );
};

export default HeartButton;

const heart = confetti.shapeFromPath({
  path: "M167 72c19,-38 37,-56 75,-56 42,0 76,33 76,75 0,76 -76,151 -151,227 -76,-76 -151,-151 -151,-227 0,-42 33,-75 75,-75 38,0 57,18 76,56z",
});
