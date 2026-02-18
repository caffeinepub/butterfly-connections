import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useListReports, useResolveReport } from '../../hooks/useModeration';
import { ReportType, ReportStatus } from '../../backend';
import type { Report, ReasonType } from '../../backend';

export default function ReportsSection() {
  const [skip] = useState(0);
  const [take] = useState(20);
  const { data: reports, isLoading, error } = useListReports(skip, take);
  const resolveReport = useResolveReport();

  const handleResolve = async (reportId: bigint) => {
    try {
      await resolveReport.mutateAsync(reportId);
    } catch (error: any) {
      console.error('Failed to resolve report:', error);
    }
  };

  const getReasonLabel = (reasonType: ReasonType): string => {
    if (reasonType.__kind__ === 'lecture') return 'Lecture';
    if (reasonType.__kind__ === 'troll') return 'Troll';
    if (reasonType.__kind__ === 'offTopic') return 'Off Topic';
    if (reasonType.__kind__ === 'violation') return 'Violation';
    if (reasonType.__kind__ === 'insensitive') return 'Insensitive';
    if (reasonType.__kind__ === 'other') return `Other: ${reasonType.other}`;
    return 'Unknown';
  };

  const getTypeLabel = (reportType: ReportType): string => {
    if (reportType === ReportType.profile) return 'Profile';
    if (reportType === ReportType.message) return 'Message';
    return 'Unknown';
  };

  if (isLoading) {
    return (
      <Card className="bg-white/70 backdrop-blur-sm border-[oklch(0.90_0.02_320)]">
        <CardHeader>
          <CardTitle className="text-[oklch(0.35_0.08_320)]">Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-[oklch(0.65_0.15_320)]" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-white/70 backdrop-blur-sm border-[oklch(0.90_0.02_320)]">
        <CardHeader>
          <CardTitle className="text-[oklch(0.35_0.08_320)]">Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 space-y-2">
            <AlertCircle className="w-12 h-12 mx-auto text-destructive" />
            <p className="text-[oklch(0.45_0.06_320)]">Failed to load reports</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-[oklch(0.90_0.02_320)]">
      <CardHeader>
        <CardTitle className="text-[oklch(0.35_0.08_320)]">Reports</CardTitle>
      </CardHeader>
      <CardContent>
        {!reports || reports.length === 0 ? (
          <div className="text-center py-8 space-y-2">
            <CheckCircle className="w-12 h-12 mx-auto text-[oklch(0.65_0.15_320)]" />
            <p className="text-[oklch(0.45_0.06_320)]">No reports to review</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => {
              const isPending = report.status === ReportStatus.pending;
              return (
                <div
                  key={report.id.toString()}
                  className="border border-[oklch(0.90_0.02_320)] rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline">{getTypeLabel(report.reportType)}</Badge>
                        <Badge variant="secondary">{getReasonLabel(report.reasonType)}</Badge>
                        {report.status === ReportStatus.reviewed ? (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            Reviewed
                          </Badge>
                        ) : (
                          <Badge variant="destructive">Pending</Badge>
                        )}
                      </div>
                      <p className="text-sm text-[oklch(0.45_0.06_320)]">
                        <span className="font-medium">Content ID:</span> {report.contentId}
                      </p>
                      <p className="text-sm text-[oklch(0.45_0.06_320)]">
                        <span className="font-medium">Reporter:</span>{' '}
                        {report.reporter.toString().slice(0, 20)}...
                      </p>
                      {report.description && (
                        <p className="text-sm text-[oklch(0.35_0.08_320)]">
                          <span className="font-medium">Description:</span> {report.description}
                        </p>
                      )}
                    </div>
                    {isPending && (
                      <Button
                        size="sm"
                        onClick={() => handleResolve(report.id)}
                        disabled={resolveReport.isPending}
                      >
                        {resolveReport.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Resolving...
                          </>
                        ) : (
                          'Mark Reviewed'
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
