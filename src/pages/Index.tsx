import React, { useState } from 'react';
import { Shield, Download, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUpload } from '@/components/FileUpload';
import { PasswordInput } from '@/components/PasswordInput';
import { SecurityNotice } from '@/components/SecurityNotice';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useToast } from '@/hooks/use-toast';
import securityHero from '@/assets/security-hero.jpg';

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [encryptedFileUrl, setEncryptedFileUrl] = useState<string | null>(null);
  
  const { toast } = useToast();

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setUploadError('');
    setIsComplete(false);
  };

  const handleEncrypt = async () => {
    if (!selectedFile) {
      setUploadError('Please select a PDF file');
      return;
    }

    if (!password) {
      setPasswordError('Please enter a password');
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }

    setIsProcessing(true);
    setPasswordError('');

    try {
      const formData = new FormData();
      formData.append('pdf', selectedFile);
      formData.append('password', password);

      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://lock-my-pdf.onrender.com';
      const response = await fetch(`${apiBaseUrl}/encrypt-pdf`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Encryption failed');
      }

      // Create blob URL for download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setEncryptedFileUrl(url);
      
      setIsComplete(true);
      toast({
        title: "PDF Encrypted Successfully",
        description: "Your PDF has been encrypted and is ready for download.",
      });
    } catch (error) {
      toast({
        title: "Encryption Failed",
        description: error instanceof Error ? error.message : "There was an error encrypting your PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (encryptedFileUrl && selectedFile) {
      const link = document.createElement('a');
      link.href = encryptedFileUrl;
      link.download = `${selectedFile.name.replace('.pdf', '')}_encrypted.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download Started",
        description: "Your encrypted PDF is being downloaded.",
      });
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPassword('');
    setConfirmPassword('');
    setIsComplete(false);
    setUploadError('');
    setPasswordError('');
    if (encryptedFileUrl) {
      window.URL.revokeObjectURL(encryptedFileUrl);
      setEncryptedFileUrl(null);
    }
  };

  const canEncrypt = selectedFile && password && confirmPassword && password === confirmPassword && password.length >= 8;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-security rounded-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-foreground">SecurePDF</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="mb-8">
            <img 
              src={securityHero} 
              alt="PDF Security" 
              className="w-full max-w-md mx-auto rounded-lg shadow-elegant"
            />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Encrypt Your PDFs with
            <span className="bg-gradient-security bg-clip-text text-transparent"> Military-Grade Security</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Protect sensitive documents with AES-256 encryption. Fast, secure, and completely private - 
            your files are never stored on our servers.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-4 pb-16">
        <div className="container mx-auto max-w-2xl">
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-primary" />
                <span>Encrypt PDF Document</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {!isComplete ? (
                <>
                  {/* File Upload */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">1. Upload Your PDF</h3>
                    <FileUpload
                      onFileSelect={handleFileSelect}
                      selectedFile={selectedFile}
                      error={uploadError}
                    />
                  </div>

                  {/* Password Setup */}
                  {selectedFile && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">2. Set Encryption Password</h3>
                      <PasswordInput
                        password={password}
                        onPasswordChange={setPassword}
                        confirmPassword={confirmPassword}
                        onConfirmPasswordChange={setConfirmPassword}
                        error={passwordError}
                      />
                    </div>
                  )}

                  {/* Encrypt Button */}
                  {selectedFile && (
                    <div className="pt-4">
                      <Button
                        variant="security"
                        size="lg"
                        onClick={handleEncrypt}
                        disabled={!canEncrypt || isProcessing}
                        className="w-full"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Encrypting PDF...
                          </>
                        ) : (
                          <>
                            <Shield className="h-5 w-5" />
                            Encrypt PDF
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                /* Success State */
                <div className="text-center space-y-6">
                  <div className="flex justify-center">
                    <div className="p-4 bg-success/10 rounded-full">
                      <CheckCircle className="h-16 w-16 text-success" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      PDF Successfully Encrypted!
                    </h3>
                    <p className="text-muted-foreground">
                      Your document is now protected with AES-256 encryption
                    </p>
                  </div>
                  <div className="space-y-3">
                    <Button
                      variant="security"
                      size="lg"
                      onClick={handleDownload}
                      className="w-full"
                    >
                      <Download className="h-5 w-5" />
                      Download Encrypted PDF
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleReset}
                      className="w-full"
                    >
                      Encrypt Another PDF
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Security Notice */}
          <div className="mt-8">
            <SecurityNotice />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-semibold">SecurePDF</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              We value your privacy. Files are never stored and are automatically deleted after encryption. 
              All processing happens securely in memory only.
            </p>
            <div className="flex justify-center space-x-6 text-sm text-muted-foreground">
              <span>AES-256 Encryption</span>
              <span>•</span>
              <span>Zero Storage</span>
              <span>•</span>
              <span>Open Source</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;