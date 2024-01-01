"""Google Analytics Data API sample application demonstrating the creation
  of a basic report.

  See https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/properties/runReport
  for more information.
"""
  # [START analyticsdata_run_report]
import os
from datetime import datetime

from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import (DateRange, Dimension, Metric,
                                                MetricType, RunReportRequest,
                                                RunReportResponse)

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "esgedu-740d2-914a8d50d8d8.json"



def views_by_city_and_page(property_id):
      """Runs a report of active users grouped by country."""
      client = BetaAnalyticsDataClient()

      request = RunReportRequest(
          property=f"properties/{property_id}",
          dimensions=[Dimension(name="city"), Dimension(name="pageTitle")],
          metrics=[Metric(name="activeUsers")],
          date_ranges=[DateRange(start_date="30daysAgo", end_date="today")],
      )
      response = client.run_report(request)
      return format_views_by_city_and_page(response)

def per_page_views(property_id):
      """Runs a report of active users grouped by country."""
      client = BetaAnalyticsDataClient()

      request = RunReportRequest(
          property=f"properties/{property_id}",
          dimensions=[Dimension(name="pageTitle")],
          metrics=[Metric(name="activeUsers")],
          date_ranges=[DateRange(start_date="30daysAgo", end_date="today")],
      )
      response = client.run_report(request)
      return format_per_page_views(response)

  
def views_by_day(property):
      """Runs a report of active users grouped by country."""
      client = BetaAnalyticsDataClient()

      request = RunReportRequest(
          property=f"properties/{property}",
          dimensions=[Dimension(name="date")],
          metrics=[Metric(name="activeUsers")],
          date_ranges=[DateRange(start_date="30daysAgo", end_date="today")],
      )
      response = client.run_report(request)
      return format_views_by_day(response)


def format_views_by_day(response:RunReportResponse)->[dict]:
    resList = []
    for row in response.rows:
        resList.append({
             "date":format_date(row.dimension_values[0].value),
             "views":row.metric_values[0].value
        })
    return resList

def format_views_by_city_and_page(response:RunReportResponse)->[dict]:
     resList = []
     for row in response.rows:
          resList.append({
               "city_name":row.dimension_values[0].value,
               "page_name":row.dimension_values[1].value,
               "views":row.metric_values[0].value
          })
     return resList

def format_per_page_views(response:RunReportResponse)->[dict]:
     resList = []
     for row in response.rows:
          resList.append({
               "page_name":row.dimension_values[0].value,
               "views":row.metric_values[0].value
          })  
     return resList



def format_date(date:str)->str:
    return ( datetime.strptime(date, "%Y%m%d")).isoformat()
