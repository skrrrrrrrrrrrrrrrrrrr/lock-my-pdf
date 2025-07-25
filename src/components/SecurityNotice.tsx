import React from 'react';
import { Shield, Lock, Eye, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export const SecurityNotice: React.FC = () => {
  return (
    <Card className="bg-security-muted border-security/20">
      <CardContent className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="h-6 w-6 text-security" />
          <h3 className="text-lg font-semibold text-security">Privacy & Security Guarantee</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-start space-x-3">
            <Lock className="h-5 w-5 text-security mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-foreground">AES-256 Encryption</p>
              <p className="text-muted-foreground">Military-grade encryption protects your documents</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Eye className="h-5 w-5 text-security mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-foreground">No Storage</p>
              <p className="text-muted-foreground">Files are processed in memory only</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Trash2 className="h-5 w-5 text-security mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-foreground">Auto-Delete</p>
              <p className="text-muted-foreground">Files deleted immediately after processing</p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-background/60 rounded-md">
          <p className="text-sm text-muted-foreground">
            <strong>Privacy Promise:</strong> All files are processed securely and are never stored. 
            We value your privacy and automatically delete files after encryption.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};