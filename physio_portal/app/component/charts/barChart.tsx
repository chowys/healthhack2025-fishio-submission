import React from "react";
import { Top5Excercise } from "@/app/dashboard/page";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

interface BarGraphProps {
  data: Top5Excercise[];
}

const BarGraph: React.FC<BarGraphProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="exerciseName" angle={-45} textAnchor="end" tick={{fontSize: 8}} />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="count" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarGraph;
