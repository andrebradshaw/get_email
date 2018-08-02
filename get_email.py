import requests
from bs4 import BeautifulSoup
import sys
import re 



def get_email(username):
    urls = []
    url = ('https://github.com/{}?utf8=%E2%9C%93&tab=repositories&q=&type=source&language='.format(username))
    response = requests.get(url)
    all_repos = (response.text) #getting all repos from source page
    soup = BeautifulSoup(all_repos, 'html.parser')
    href_tags = soup.findAll('a',  itemprop="name codeRepository")
    for item in href_tags:
        url = 'https://github.com' + item['href']
        urls.append(url)

        for url in urls:
            if len(urls) >= 1:
                try:
                    response = requests.get(url)
                    data = response.text
                    soup = BeautifulSoup(data, 'html.parser')
                    commit_link = soup.find_all('a', {'class':'commit-tease-sha'})
                    if commit_link[0]['href']:
                        print('SUCCESS !!!')
                        new_response = requests.get('https://github.com{}.patch'.format(commit_link[0]['href']))
                        final_data = new_response.text
                        emails = re.findall(r'[\w\.-]+@[\w\.-]+', final_data)
                        for email in emails:
                            return email
                except IndexError:
                    print('Nothing found here, moving to next repo')




def main():

    if sys.argv[1] == '-g' and sys.argv[2]:
        print(get_email(sys.argv[2]))



if __name__ == '__main__':

    main()
