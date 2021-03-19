import requests
import json
from collections import OrderedDict
from bs4 import BeautifulSoup
from multiprocessing import Pool, Manager, freeze_support
from sys import stdin, stdout

def getInfo(obj, code):
    url = "https://finance.naver.com/item/main.nhn?code=" + code
    result = requests.get(url)
    bs_obj = BeautifulSoup(result.content, "html.parser")
    
    no_today = bs_obj.find("p", {"class": "no_today"}) # 태그 p, 속성값 no_today 찾기
    blind = no_today.find("span", {"class": "blind"})  # 태그 span, 속성값 blind 찾기

    now_price = blind.text

    obj[code] = now_price.replace(",", "")


if __name__ == "__main__":
    manger = Manager()
    pricePerCode = manger.dict()
    codes = ["005930"]
    
    args = []
    for code in codes:
        args.append((pricePerCode, code))

    pool = Pool(processes=1)
    freeze_support()
    pool.starmap(getInfo, args)

    stdout.write(json.dumps(pricePerCode.copy()))
    pool.close()