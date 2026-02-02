"use client";

import React, { useState } from "react";

interface DateInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    placeholder: string;
}

export function DateInput({ placeholder, className, ...props }: DateInputProps) {
    const [type, setType] = useState(props.defaultValue ? "date" : "text");

    return (
        <input
            {...props}
            type={type}
            placeholder={placeholder}
            onFocus={() => setType("date")}
            onBlur={(e) => setType(e.target.value ? "date" : "text")}
            className={className}
        />
    );
}
