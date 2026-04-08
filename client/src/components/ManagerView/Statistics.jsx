// Statistics.jsx

import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import "./styles/Statistics.css";
import { PageContext } from "./ManagerView";
import { Translate } from "../Translation/TranslationWrapper";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

function Statistics() {
  const { setPage } = useContext(PageContext);
  useEffect(() => {
    setPage("statistics");
  }, []);
  const [selectedQuery, setSelectedQuery] = useState("");
  const [tableData, setTableData] = useState([]);
  const [tableHeaders, setTableHeaders] = useState([]);

  const [selectedReport, setSelectedReport] = useState("");
  const [chartData, setChartData] = useState(null);

  // Define the list of queries for the dropdown
  const queries = [
    { id: "weekly_order_statistics", label: "Weekly Order Statistics" },
    { id: "hourly_sales_data", label: "Hourly Sales Data" },
    { id: "top_10_highest", label: "Top 10 Highest Sales" },
    {
      id: "ingredient_count_for_each_item",
      label: "Ingredient Count For Each Item",
    },
    { id: "sales_By_Payment_Method", label: "Sales By Payment Method" },
    { id: "total_Money_All_Orders", label: "Total Money All Orders" },
    { id: "most_Expensive_Order", label: "Most Expensive Order" },
    { id: "employee_Num_Orders_Taken", label: "Employee Number Orders Taken" },
    // Add more queries as needed
  ];

  // Define the list of reports for the buttons
  const reports = [
    { id: "x_report_sales", label: "GENERATE X-REPORT SALES" },
    { id: "z_report", label: "GENERATE Z-REPORT" },
    { id: "x_report_payment_type", label: "GENERATE X-REPORT PAYMENT TYPE" },
    // Add more reports as needed
  ];

  // Handle query selection from dropdown
  const handleQueryChange = (e) => {
    const queryId = e.target.value;
    setSelectedQuery(queryId);
    setSelectedReport(""); // Clear any selected report
    setChartData(null); // Clear chart data
  };

  // Handle report button clicks
  const handleReportClick = (reportId) => {
    setSelectedReport(reportId);
    setSelectedQuery(""); // Clear any selected query
    setTableData([]); // Clear table data
    setTableHeaders([]);
  };

  // Fetch data for table queries
  useEffect(() => {
    if (selectedQuery) {
      fetchDataForQuery(selectedQuery);
    }
  }, [selectedQuery]);

  const fetchDataForQuery = async (queryId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/manager/statistics/${queryId}`,
      );
      if (response.data && response.data.length > 0) {
        // Set table headers based on keys of the first data object
        setTableHeaders(Object.keys(response.data[0]));
        setTableData(response.data);
      } else {
        setTableHeaders([]);
        setTableData([]);
      }
    } catch (error) {
      console.error("Error fetching data for query:", error);
      setTableHeaders([]);
      setTableData([]);
    }
  };

  // Fetch data for reports
  useEffect(() => {
    if (selectedReport) {
      fetchDataForReport(selectedReport);
    }
  }, [selectedReport]);

  const fetchDataForReport = async (reportId) => {
    try {
      let endpoint = "";

      switch (reportId) {
        case "x_report_sales":
          endpoint = "/api/manager/statistics/x-report-sales";
          break;
        case "z_report":
          endpoint = "/api/manager/statistics/z-report";
          break;
        case "x_report_payment_type":
          endpoint = "/api/manager/statistics/x-report-payment-type";
          break;
        // Add more cases as needed
        default:
          return;
      }
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}${endpoint}`,
      );
      const data = response.data;
      prepareChartData(reportId, data);
    } catch (error) {
      console.error("Error fetching report data:", error);
      setChartData(null);
    }
  };

  const prepareChartData = (reportId, data) => {
    let labels = [];
    let dataset = [];

    switch (reportId) {
      case "x_report_sales":
        labels = data.map((item) => `${item.hour_of_day}:00`);
        dataset = data.map((item) => parseFloat(item.total_sales));
        setChartData({
          labels,
          datasets: [
            {
              label: "Total Sales ($)",
              data: dataset,
              backgroundColor: "rgba(75,192,192,0.6)",
            },
          ],
        });
        break;

      case "z_report":
        labels = data.map((item) => item.payment_type);
        dataset = data.map((item) => parseFloat(item.total_sales));
        setChartData({
          labels,
          datasets: [
            {
              label: "Total Sales ($)",
              data: dataset,
              backgroundColor: "rgba(153,102,255,0.6)",
            },
          ],
        });
        break;

      case "x_report_payment_type":
        labels = data.map((item) => item.payment_type);
        dataset = data.map((item) => parseInt(item.method_count));
        setChartData({
          labels,
          datasets: [
            {
              label: "Payment Method Count",
              data: dataset,
              backgroundColor: "rgba(255,159,64,0.6)",
            },
          ],
        });
        break;

      // Add more cases as needed
      default:
        setChartData(null);
        break;
    }
  };
  return (
    <>
      <h1 className="pageTitle"><Translate>Statistics</Translate></h1>
      <div className="statistics-controls">
        {/* Dropdown for table-based queries */}
        <div className="query-section">
          <label htmlFor="querySelect"><Translate>Select a query:</Translate></label>
          <select id="querySelect" value={selectedQuery} onChange={handleQueryChange}>
            <option value=""><Translate>--Select a query--</Translate></option>
            {queries.map((query) => (
              <option key={query.id} value={query.id}>
                <Translate>{query.label}</Translate>
              </option>
            ))}
          </select>
        </div>

        {/* Buttons for generating reports */}
        <div className="report-section">
          {reports.map((report) => (
            <button
              key={report.id}
              className="default-button-red report-button"
              onClick={() => handleReportClick(report.id)}
            >
              <Translate>{report.label}</Translate>
            </button>
          ))}
        </div>
      </div>

      {/* Display the table for dropdown queries */}
      {tableData.length > 0 ? (
        <table className="statistics-table">
          <thead>
            <tr>
              {tableHeaders.map((header, index) => (
                <th key={index}><Translate>{header.replace(/_/g, ' ').toUpperCase()}</Translate></th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={index}>
                {tableHeaders.map((header, idx) => (
                  <td key={idx}><Translate>{row[header]}</Translate></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : selectedQuery ? (
        <p><Translate>No data available for the selected query.</Translate></p>
      ) : null}

      {/* Display the bar graph for reports */}
      {chartData ? (
        <div className="chart-container">
          <Bar
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: selectedReport.replace(/_/g, ' ').toUpperCase(),
                },
              },
              scales: {
                x: {
                  beginAtZero: true,
                },
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
      ) : selectedReport ? (
        <p><Translate>No data available for the selected report.</Translate></p>
      ) : null}
    </>
  );
}

export default Statistics;
