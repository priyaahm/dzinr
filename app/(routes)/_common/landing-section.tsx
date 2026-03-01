"use client"
import PromptInput from '@/components/prompt-input'
import React, { useState } from 'react'

const LandingSection = () => {
    const[promptText,setPromptText] = useState<string>("");

    // start with the suggestions code 

  return (
    <div className="w-full min-h-screen">
      <div className="flex flex-col">
        {/* header */}
        <div className="relative overflow-hidden pt-28">
            <div className="max-w-6xl mx-auto flex flex-col items-center justify-center">
                <div className="space-y-3">
                    <h1 
                    className="text-center font-semibold text-4xl tracking-tight sm:text-5xl">
                        Design mobile apps <br className="md:hidden" />
                       <span className="text-primary">in minutes</span>
                    </h1>
                    <p className="mx-auto max-w-2xl text-center font-medium text-foreground leading-relaxed sm:text-lg">
                        Go from idea to beautiful app mockups in minutes by chatting with AI.
                    </p>
                    <div className="flex w-full max-w-3xl flex-col items-center gap-8 relative z-50">
                        <div className="w-full">
                            <PromptInput 
                            className="ring-2 ring-primary"
                            promptText={promptText}
                            setPromptText={setPromptText}
                            isLoading={false}
                            onSubmit={()=>{}}
                            />
                        </div>
                        <div className="flex flex-wrap justify-center gap-2 px-5">

                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default LandingSection;
