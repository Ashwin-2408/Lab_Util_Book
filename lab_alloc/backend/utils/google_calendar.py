import os.path
from datetime import datetime, timedelta
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from google.auth.transport.requests import Request
import pytz

SCOPES = ['https://www.googleapis.com/auth/calendar']

def get_calendar_service():
    creds = None
    token_path = 'token.json'
    creds_path = 'credentials.json'

    if os.path.exists(token_path):
        creds = Credentials.from_authorized_user_file(token_path, SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(creds_path, SCOPES)
            creds = flow.run_local_server(port=8765)
        with open(token_path, 'w') as token:
            token.write(creds.to_json())

    return build('calendar', 'v3', credentials=creds)

def get_events_on_date(target_date):
    service = get_calendar_service()
    
    if isinstance(target_date, str):
        target_date = datetime.strptime(target_date, "%Y-%m-%d")
    
    start_of_day = target_date.replace(hour=0, minute=0, second=0).isoformat() + 'Z'
    end_of_day = (target_date + timedelta(days=1)).replace(hour=0, minute=0, second=0).isoformat() + 'Z'

    events_result = service.events().list(
        calendarId='primary',
        timeMin=start_of_day,
        timeMax=end_of_day,
        singleEvents=True,
        orderBy='startTime'
    ).execute()

    events = events_result.get('items', [])
    return [
        {
            "summary": event.get("summary"),
            "start": event.get("start"),
            "end": event.get("end")
        } for event in events
    ]

def add_event_to_calendar(summary, description, event_date, start_time, end_time):
    service = get_calendar_service()

    start_dt = datetime.strptime(f"{event_date} {start_time}", "%Y-%m-%d %H:%M:%S")
    end_dt = datetime.strptime(f"{event_date} {end_time}", "%Y-%m-%d %H:%M:%S")

    event = {
        'summary': summary,
        'description': description,
        'start': {
            'dateTime': start_dt.isoformat() + 'Z',
            'timeZone': 'UTC',
        },
        'end': {
            'dateTime': end_dt.isoformat() + 'Z',
            'timeZone': 'UTC',
        },
    }

    event = service.events().insert(calendarId='primary', body=event).execute()
    print(f"Event created: {event.get('htmlLink')}")