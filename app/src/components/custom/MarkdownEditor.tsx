"use client";
import React, { useState, useRef } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Download, Upload, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import 'highlight.js/styles/github-dark.css';
import showdown from 'showdown';

const MarkdownEditor: React.FC = () => {
    const [markdown, setMarkdown] = useState<string>('');
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const getMarkdownPreview = () => {
        var converter = new showdown.Converter({
            tables: true,
            simplifiedAutoLink: true,
            excludeTrailingPunctuationFromURLs: true
        });
        return { __html: converter.makeHtml(markdown) };
    };

    const handleMarkdownChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMarkdown(event.target.value);
    };

    const handleDownload = () => {
        const blob = new Blob([markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'document.md';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result;
                if (typeof content === 'string') {
                    setMarkdown(content);
                }
            };
            reader.readAsText(file);
        }
        if (event.target) {
            event.target.value = '';
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file && (file.name.endsWith('.md') || file.name.endsWith('.markdown'))) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result;
                if (typeof content === 'string') {
                    setMarkdown(content);
                }
            };
            reader.readAsText(file);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-center px-4 py-2 border-b">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <FileText className="h-5 w-5" />
                    <span className="text-sm font-medium">
                        {markdown ? `${markdown.split(' ').length} words` : 'No content'}
                    </span>
                </div>
                <div className="flex gap-2">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept=".md,.markdown"
                        className="hidden"
                    />
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleUploadClick}
                        className="flex items-center gap-2 transition-all hover:scale-105"
                    >
                        <Upload className="h-4 w-4" />
                        Upload
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownload}
                        className="flex items-center gap-2 transition-all hover:scale-105"
                        disabled={!markdown}
                    >
                        <Download className="h-4 w-4" />
                        Download
                    </Button>
                </div>
            </div>

            <div className="hidden md:flex flex-1 p-4">
                <div className="grid grid-cols-2 gap-6 h-full w-full">
                    <Card className="flex flex-col">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg font-semibold">Editor</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 p-0">
                            <div
                                className={cn(
                                    "relative h-full p-4",
                                    isDragging && "ring-2 ring-primary"
                                )}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                {isDragging && (
                                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-md flex items-center justify-center z-50">
                                        <p className="text-lg font-medium">Drop your markdown file here</p>
                                    </div>
                                )}
                                <Textarea
                                    value={markdown}
                                    onChange={handleMarkdownChange}
                                    placeholder="Write your markdown here..."
                                    className="h-full font-mono resize-none focus-visible:ring-1 bg-background transition-colors duration-200"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="flex flex-col">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg font-semibold">Preview</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 p-0">
                            <ScrollArea className="h-[70vh] p-4 bg-background">
                                <div
                                    className="prose prose-sm dark:prose-invert max-w-none animate-in fade-in duration-200"
                                    dangerouslySetInnerHTML={getMarkdownPreview()}
                                />
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="block md:hidden flex-1">
                <Tabs defaultValue="editor" className="flex flex-col h-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="editor" className="transition-all data-[state=active]:font-medium">Editor</TabsTrigger>
                        <TabsTrigger value="preview" className="transition-all data-[state=active]:font-medium">Preview</TabsTrigger>
                    </TabsList>
                    <TabsContent value="editor" className="flex-1 mt-2 data-[state=active]:flex">
                        <Card className="flex flex-col flex-1">
                            <CardContent className="flex-1 p-4">
                                <div
                                    className={cn(
                                        "relative h-full",
                                        isDragging && "ring-2 ring-primary"
                                    )}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                >
                                    {isDragging && (
                                        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-md flex items-center justify-center z-50">
                                            <p className="text-lg font-medium">Drop your markdown file here</p>
                                        </div>
                                    )}
                                    <Textarea
                                        value={markdown}
                                        onChange={handleMarkdownChange}
                                        placeholder="Write your markdown here..."
                                        className="h-full font-mono bg-background scrollbar-thin scrollbar-thumb-rounded-md scrollbar-track-transparent scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 hover:scrollbar-thumb-slate-400 dark:hover:scrollbar-thumb-slate-500 transition-colors duration-200"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="preview" className="flex-1 mt-2 data-[state=active]:flex">
                        <Card className="flex flex-col flex-1">
                            <CardContent className="flex-1 p-4">
                                <ScrollArea className="h-full bg-background scrollbar-thin scrollbar-thumb-rounded-md scrollbar-track-transparent scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 hover:scrollbar-thumb-slate-400 dark:hover:scrollbar-thumb-slate-500">
                                    <div
                                        className="h-[68vh] prose prose-sm dark:prose-invert max-w-none animate-in fade-in duration-200"
                                        dangerouslySetInnerHTML={getMarkdownPreview()}
                                    />
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default MarkdownEditor;
