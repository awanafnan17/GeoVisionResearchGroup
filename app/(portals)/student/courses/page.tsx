"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/portals/shared/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Spinner } from "@/components/ui/Spinner";
import { formatDateShort } from "@/lib/utils";
import {
  portalFetch,
  extractArray,
  type PortalEnrollment,
  type SyllabusModule,
} from "@/components/portals/shared/portal-api";
import { GraduationCap, Award, Calendar, User, Compass } from "lucide-react";

export default function StudentCoursesPage() {
  const [enrollments, setEnrollments] = useState<PortalEnrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCourses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await portalFetch("/api/portal/courses");
      setEnrollments(extractArray<PortalEnrollment>(res, ["enrollments", "courses"]));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load enrolled courses");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadCourses();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadCourses]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" color="gold" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Courses & Curriculum"
        subtitle="Access your enrolled training programs, syllabus modules, schedules, and completion certificates"
        action={
          <Link href="/courses">
            <Button variant="outline" size="sm" leftIcon={<Compass className="h-4 w-4" />}>
              Browse More Courses
            </Button>
          </Link>
        }
      />

      {error && <Alert variant="error" title="Error" message={error} onClose={() => setError(null)} />}

      {enrollments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <GraduationCap className="h-12 w-12 text-geo-slate/30 mb-3" />
            <h3 className="text-base font-semibold text-geo-white mb-1">No course enrollments yet</h3>
            <p className="text-xs text-geo-slate max-w-md mb-4">
              Enroll in one of Geo Vision Research Group&apos;s specialized geological training courses to view syllabus modules and schedules here.
            </p>
            <Link href="/courses">
              <Button size="sm">Explore Training Programs</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {enrollments.map((enr) => {
            const course = enr.course;
            const syllabusModules: SyllabusModule[] = Array.isArray(course?.syllabus)
              ? (course.syllabus as SyllabusModule[])
              : [];

            return (
              <Card key={enr.id}>
                <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <Badge variant="info" size="sm">
                        {course?.mode || "ONLINE"}
                      </Badge>
                      <Badge
                        variant={
                          enr.status === "CONFIRMED" || enr.status === "COMPLETED"
                            ? "success"
                            : enr.status === "CANCELLED"
                              ? "danger"
                              : "warning"
                        }
                        size="sm"
                        dot
                      >
                        Enrollment: {enr.status}
                      </Badge>
                      {course?.certificate && (
                        <Badge variant="gold" size="sm">
                          <Award className="h-3 w-3 mr-1" />
                          Certificate Included
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg">{course?.title || "Geoscience Course"}</CardTitle>
                  </div>
                  <div className="text-xs text-geo-slate">
                    Enrolled on {formatDateShort(enr.createdAt)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3.5 rounded-none bg-[#0D1F35] border border-white/[0.06] text-xs">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-geo-gold shrink-0" />
                      <div>
                        <span className="text-geo-slate block">Instructor</span>
                        <span className="text-geo-white font-medium">
                          {course?.instructor?.name || course?.instructor?.email || "Geo Vision Faculty"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-geo-gold shrink-0" />
                      <div>
                        <span className="text-geo-slate block">Schedule & Duration</span>
                        <span className="text-geo-white font-medium">
                          {course?.schedule || course?.durationText || "Flexible Schedule"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-geo-gold shrink-0" />
                      <div>
                        <span className="text-geo-slate block">Certificate Status</span>
                        <span className="text-geo-white font-medium">
                          {enr.status === "COMPLETED"
                            ? "Ready for Download"
                            : enr.status === "CONFIRMED"
                              ? "In Progress (Issued on Completion)"
                              : "Awaiting Payment Verification"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {syllabusModules.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-geo-slate">
                        Course Syllabus Modules
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                        {syllabusModules.map((mod, idx) => (
                          <div key={idx} className="p-3 rounded-none bg-white/[0.02] border border-white/[0.05]">
                            <p className="text-xs font-semibold text-geo-gold">
                              Module {idx + 1}: {mod.title}
                            </p>
                            {mod.description && (
                              <p className="text-xs text-geo-slate mt-1">{mod.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
