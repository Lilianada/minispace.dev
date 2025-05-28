'use client';

import RichTextEditor from '@/components/shared/RichTextEditor';

// Re-export the shared RichTextEditor with dashboard variant as default
export default function DashboardRichTextEditor(props: Parameters<typeof RichTextEditor>[0]) {
  return <RichTextEditor variant="dashboard" {...props} />;
}
