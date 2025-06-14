import { useState, useCallback, useEffect } from 'react';
import { Upload, FileText, Download, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import DarkModeToggle from '@/components/DarkModeToggle';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:5000');

interface UploadedFile {
  id: string;
  file: File;
  status: 'pending' | 'converting' | 'completed' | 'error';
  progress: number;
  error?: string;
}

const Index = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('file-processing-start', ({ filename }) => {
      setFiles(prev => prev.map(f => 
        f.file.name === filename ? { ...f, status: 'converting', progress: 0 } : f
      ));
    });

    socket.on('file-processing-complete', ({ filename }) => {
      setFiles(prev => prev.map(f => 
        f.file.name === filename ? { ...f, status: 'completed', progress: 100 } : f
      ));
    });

    socket.on('file-processing-error', ({ filename, error }) => {
      setFiles(prev => prev.map(f => 
        f.file.name === filename ? { ...f, status: 'error', error: error } : f
      ));
    });

    socket.on('all-files-complete', ({ downloadUrl }) => {
      setDownloadUrl(downloadUrl);
      setIsConverting(false);
      toast({
        title: "Conversion complete!",
        description: "All documents have been converted to markdown",
      });
    });

    return () => {
      socket.off('connect');
      socket.off('file-processing-start');
      socket.off('file-processing-complete');
      socket.off('file-processing-error');
      socket.off('all-files-complete');
    };
  }, [toast]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      addFiles(selectedFiles);
    }
  }, []);

  const addFiles = (newFiles: File[]) => {
    const uploadedFiles: UploadedFile[] = newFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      status: 'pending',
      progress: 0
    }));
    
    setFiles(prev => [...prev, ...uploadedFiles]);
    setDownloadUrl(null);
    
    toast({
      title: "Files uploaded",
      description: `${newFiles.length} file(s) ready for conversion`,
    });
  };

  const convertFiles = async () => {
    setIsConverting(true);
    setDownloadUrl(null);
    
    const formData = new FormData();
    files.forEach(f => {
      formData.append('files', f.file);
    });
    formData.append('socketId', socket.id);

    try {
      await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    } catch (error) {
      console.error('Error uploading files:', error);
      setIsConverting(false);
      toast({
        title: "Upload failed",
        description: "Could not connect to the server.",
        variant: "destructive"
      });
    }
  };

  const clearFiles = () => {
    setFiles([]);
    setDownloadUrl(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 transition-colors">
      <DarkModeToggle />
      
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-8">
            <div className="w-8 h-8 bg-black dark:bg-white flex items-center justify-center">
              <div className="w-4 h-4 bg-white dark:bg-black"></div>
            </div>
            <span className="text-lg font-medium tracking-wider text-gray-900 dark:text-white">DOCLING-UI</span>
          </div>
          
          <div className="relative">
            <h1 className="text-6xl md:text-8xl font-black leading-[0.85] mb-6 tracking-ultra-tight text-gray-900 dark:text-white">
              Convert any
              <br />
              <span className="relative">
                documents to
                <div className="absolute -top-4 -right-8 w-16 h-16 bg-red-500 rounded-full opacity-80 blur-xl"></div>
              </span>
              <br />
              LLM understandable
              <br />
              <span className="relative">
                markdown using docling.
                <div className="absolute -bottom-4 -left-8 w-20 h-20 bg-green-400 rounded-full opacity-60 blur-xl"></div>
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mt-8 font-normal tracking-extra-tight">
              Become markdown conversation.
              <span className="block w-64 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 mx-auto mt-3"></span>
            </p>
          </div>
        </div>

        {/* Upload Area */}
        <div className="max-w-4xl mx-auto mb-12">
          <div
            className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
              isDragOver
                ? 'border-red-500 bg-red-50 dark:bg-red-950/20 scale-105'
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center gap-6">
              <div className="relative">
                <Upload className="w-16 h-16 text-gray-400 dark:text-gray-500" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">+</span>
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white tracking-extra-tight">Drop your documents here</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 font-normal">
                  Support for PDF, DOCX, TXT, and more formats
                </p>
                
                <input
                  type="file"
                  multiple
                  accept=".pdf,.docx,.doc,.txt,.rtf"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button className="bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 dark:text-black text-white px-8 py-3 text-lg font-medium">
                    Choose Files
                  </Button>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Files List */}
        {files.length > 0 && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-extra-tight">
                Documents ({files.length})
              </h2>
              <div className="flex gap-3">
                <Button 
                  onClick={clearFiles}
                  variant="outline"
                  className="px-6 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Clear All
                </Button>
                <Button
                  onClick={convertFiles}
                  disabled={isConverting || files.every(f => f.status !== 'pending')}
                  className="bg-green-500 hover:bg-green-600 text-white px-8 font-medium"
                >
                  {isConverting ? 'Converting...' : 'Convert to Markdown'}
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        file.status === 'completed' ? 'bg-green-100 dark:bg-green-900/20' :
                        file.status === 'converting' ? 'bg-blue-100 dark:bg-blue-900/20' :
                        file.status === 'error' ? 'bg-red-100 dark:bg-red-900/20' : 'bg-gray-100 dark:bg-gray-700'
                      }`}>
                        {file.status === 'completed' ? (
                          <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                        ) : file.status === 'error' ? (
                          <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                        ) : (
                          <FileText className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                        )}
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white tracking-extra-tight">{file.file.name}</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-normal">
                          {(file.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {file.status === 'converting' && (
                        <div className="w-32">
                          <Progress value={file.progress} className="h-2" />
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
                            {Math.round(file.progress)}%
                          </p>
                        </div>
                      )}
                      
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        file.status === 'completed' ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400' :
                        file.status === 'converting' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400' :
                        file.status === 'error' ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400' :
                        'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                      }`}>
                        {file.status === 'pending' ? 'Ready' :
                         file.status === 'converting' ? 'Converting' :
                         file.status === 'completed' ? 'Complete' : 'Error'}
                      </div>
                    </div>
                  </div>
                  {file.status === 'error' && file.error && (
                    <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <p className="text-sm text-red-700 dark:text-red-300">{file.error}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {downloadUrl && (
              <div className="mt-8 text-center">
                <a href={downloadUrl} download="converted_files.zip">
                  <Button className="bg-red-500 hover:bg-red-600 text-white px-12 py-4 text-xl font-bold">
                    <Download className="w-6 h-6 mr-3" />
                    Download All
                  </Button>
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
