'use client'

import { ChangeEvent, useEffect, useState } from "react";

type InputGameProps = {
    id: string;
    label: string;
    value?: any;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function InputGame({ id, label, value, onChange }: InputGameProps) {
    const [localValue, setLocalValue] = useState(value || '');

    useEffect(() => {
        setLocalValue(value)
    }, [value])

    return (
        <div className='mb-2 mx-5'>
            <label
                className='pl-2 block'
                    htmlFor={`${id}`}>
                {label}
            </label>
            <input
                className='border-2 border-gray-200 rounded-sm pl-3 leading-8 w-full'
                id={id}
                value={localValue}
                type="text"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setLocalValue(e.target.value);
                    onChange(e);
                }} />
        </div>
    )
}