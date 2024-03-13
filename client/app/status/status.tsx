"use client";

import { useEffect, useState } from "react";
import { checkBackEndHealthStatus } from "@/api";
import { statusDown } from "@/constants";
import { HealthCheckData, HealthCheckStatus } from "@/interfaces";
import { AxiosError } from "axios";
import { CheckCircle, XCircle } from "lucide-react";

import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import Legend from "@/components/status/legend";
import ServiceItem from "@/components/status/service-item";

import Loading from "./loading";

const renderServiceItem = (status: HealthCheckStatus) => {
  const { name, status: serviceStatus, message } = status;
  return <ServiceItem key={name} name={name} status={serviceStatus} message={message} />;
};

const StatusPage: React.FC = () => {
  const [statusData, setStatusData] = useState<HealthCheckData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const healthCheckResponse = await checkBackEndHealthStatus();
        setStatusData(healthCheckResponse.data);
      } catch (error) {
        if (error instanceof AxiosError) {
          toast({
            title: `API ERROR - ${error.code}`,
            description: error.response?.data.error || "An error occurred while fetching data from the API.",
          });
        } else {
          toast({
            title: "Unexpected Error!",
            description: "An unexpected error occurred. Please try again later.",
          });
        }

        setStatusData(statusDown.data);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  if (loading || !statusData) {
    return <Loading />;
  }

  const { message, uptime, responseTime, openaiStatus, prismaStatus, apiStatus } = statusData;

  return (
    <div className="container mx-auto px-5 py-12 sm:px-10">
      <div className="mb-12 text-center">
        {message === "All Systems Are Operational" ? <CheckCircle className="mx-auto size-20 text-green-500" /> : <XCircle className="mx-auto size-20 text-red-500" />}
        <h1 className="my-3 text-3xl font-semibold lg:text-4xl">{message}</h1>
        <Label className="sm:text-md mt-2 inline-block text-sm">Uptime: {Math.floor(uptime)}s</Label>
        <br />
        <Label className="sm:text-md mt-2 inline-block text-sm">
          Response time: {responseTime[0].toFixed(0)}s {Math.round(responseTime[1] / 1e6)}ms
        </Label>
      </div>
      <Legend />
      <div className="mb-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {renderServiceItem(openaiStatus)}
          {renderServiceItem(prismaStatus)}
          {renderServiceItem(apiStatus)}
        </div>
      </div>
    </div>
  );
};

export default StatusPage;
