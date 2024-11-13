import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import json
import re


base_url = "https://catalog.ucsd.edu/front/courses.html"


def get_course_links(base_url):
    response = requests.get(base_url)
    soup = BeautifulSoup(response.text, 'html.parser')
    links = []
    for a_tag in soup.find_all('a', href=True):
        href = a_tag['href']
        if href.startswith('../courses/'):
            links.append(urljoin(base_url, href))
    return links


def extract_course_names(course_url):
    response = requests.get(course_url)

    if response.status_code != 200:
        print(f"Failed to fetch {course_url}: {response.status_code}")
        return []

    soup = BeautifulSoup(response.text, 'html.parser')
    course_ids = [] = []

    for p_tag in soup.find_all('p', attrs={'class': 'anchor-parent'}):
        a_tag = p_tag.find('a')
        if a_tag and 'id' in a_tag.attrs:
            raw_id = a_tag['id']
            formatted_id = re.sub(r'(\D+)(\d+)', r'\1 \2', raw_id)
            course_ids.append(formatted_id.strip().upper())

    return course_ids


if __name__ == "__main__":
    course_links = get_course_links(base_url)
    print(f"Found {len(course_links)} course links.")

    all_courses = {}
    for course_link in course_links:
        print(f"Scraping: {course_link}")
        course_names = extract_course_names(course_link)
        all_courses[course_link] = course_names

    output_file = "ucsd_courses.json"
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(all_courses, f, indent=4)

    print(f"Course data saved to {output_file}")
