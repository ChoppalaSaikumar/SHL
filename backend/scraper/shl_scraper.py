import requests
from bs4 import BeautifulSoup
import json
import logging
from typing import List, Dict

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SHLScraper:
    def __init__(self, base_url="https://www.shl.com/shl-test-catalog/"):
        self.base_url = base_url
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }

    def scrape_catalog(self) -> List[Dict]:
        return self.get_seed_data()

    def get_seed_data(self) -> List[Dict]:
        return [
            # PERSONALITY & BEHAVIOR
            {
                "name": "OPQ32 (Occupational Personality Questionnaire)",
                "url": "https://www.shl.com/en/assessments/personality/opq/",
                "test_type": "P",
                "category": "Personality",
                "description": "Measures 32 dimensions of personality to predict job performance.",
                "skills_measured": "Influence, Sociability, Analysis, Creativity, Resilience",
                "duration": "25-35 mins"
            },
            {
                "name": "Sales Transformation (Sales OPQ)",
                "url": "https://www.shl.com/en/solutions/sales-transformation/",
                "test_type": "P",
                "category": "Sales",
                "description": "Specific personality insights tailored for high-performance sales roles.",
                "skills_measured": "Closing, Relationship Building, Achievement Orientation",
                "duration": "20-25 mins"
            },
            {
                "name": "Motivation Questionnaire (MQ)",
                "url": "https://www.shl.com/en/assessments/personality/motivation-questionnaire/",
                "test_type": "P",
                "category": "Behavioral",
                "description": "Understand what drives and demotivates your employees.",
                "skills_measured": "Growth mindset, Values, Cultural fit",
                "duration": "20 mins"
            },
            # COGNITIVE & ABILITY
            {
                "name": "Verify Interactive - G+",
                "url": "https://www.shl.com/en/assessments/cognitive-ability/verify-interactive-g-plus/",
                "test_type": "A",
                "category": "Cognitive",
                "description": "Mobile-first, interactive assessment of general mental ability.",
                "skills_measured": "Problem Solving, Deductive Reasoning, Numerical Ability",
                "duration": "24 mins"
            },
            {
                "name": "Graduate/Managerial Numerical Reasoning",
                "url": "https://www.shl.com/en/assessments/cognitive-ability/numerical-reasoning/",
                "test_type": "A",
                "category": "Analytical",
                "description": "Measures the ability to evaluate data and make data-driven decisions.",
                "skills_measured": "Data interpretation, Trend analysis, Mental math",
                "duration": "20 mins"
            },
            {
                "name": "Critical Reasoning Test Battery (CRTB)",
                "url": "https://www.shl.com/en/assessments/cognitive-ability/",
                "test_type": "A",
                "category": "Management",
                "description": "High-level reasoning for executive and senior management hires.",
                "skills_measured": "Verbal Logic, Numerical Logic, Critical Analysis",
                "duration": "40 mins"
            },
            # SKILLS & TECHNICAL
            {
                "name": "Java 8 (Advanced)",
                "url": "https://www.shl.com/en/assessments/skills/it-skills/",
                "test_type": "K",
                "category": "Technical",
                "description": "Deep-dive assessment for senior Java developers.",
                "skills_measured": "Streams, Concurrency, OOP Design, Algorithms",
                "duration": "45 mins"
            },
            {
                "name": "Python 3 - Standard",
                "url": "https://www.shl.com/en/assessments/skills/it-skills/",
                "test_type": "K",
                "category": "Technical",
                "description": "Core Python proficiency for software engineers.",
                "skills_measured": "Data structures, PEP8, Standard library",
                "duration": "30 mins"
            },
            {
                "name": "SQL Data Manipulation",
                "url": "https://www.shl.com/en/assessments/skills/it-skills/",
                "test_type": "K",
                "category": "Technical",
                "description": "Assesses ability to write complex queries and manage databases.",
                "skills_measured": "JOINs, Aggregations, Optimization, Schema Design",
                "duration": "30 mins"
            },
            # LEADERSHIP
            {
                "name": "Scenarios (Leadership SJT)",
                "url": "https://www.shl.com/en/assessments/personality/scenarios/",
                "test_type": "J",
                "category": "Leadership",
                "description": "Measures managerial judgement and decision-making style.",
                "skills_measured": "Strategic Thinking, Team Management, Delegation",
                "duration": "20-30 mins"
            },
            {
                "name": "Leader Edge",
                "url": "https://www.shl.com/en/solutions/leadership-hiring-and-development/",
                "test_type": "P",
                "category": "Executive",
                "description": "Identifies high-potential leaders using behavioral and cognitive data.",
                "skills_measured": "Visionary Leadership, Executive Presence, Emotional Intelligence",
                "duration": "45 mins"
            }
        ]
