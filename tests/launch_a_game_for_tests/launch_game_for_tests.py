from selenium import webdriver
import time
from selenium.webdriver.chrome.options import Options

options = Options()
# Fenêtre plus petite = moins de pixels à dessiner
options.add_argument("--window-size=1920,1280")

# Désactiver GPU (à tester, parfois WebGL aime pas, mais sur certains setups ça aide)
options.add_argument("--disable-gpu")

# Optimisations classiques en CI
options.add_argument("--disable-dev-shm-usage")
options.add_argument("--no-sandbox")

# Mode headless (nouvelle version – WebGL marche mieux qu’avant)
# Si ça casse ton WebGL, commente cette ligne
options.add_argument("--headless=new")

driver = webdriver.Chrome()
driver.get("http://localhost:5173/")

username_input = driver.find_element("id", "username")
username_input.send_keys("Player 1")

create_game_button = driver.find_element("id", "createGame")
create_game_button.click()

code = driver.find_element("id", "code").text

#JOUEUR 2
driver.execute_script("window.open('http://localhost:5173/', '_blank');")
tabs = driver.window_handles
driver.switch_to.window(tabs[1])

username_input2 = driver.find_element("id", "username")
username_input2.send_keys("Player 2")

join_game_button_2 = driver.find_element("id", "joinGame")
join_game_button_2.click()

code_input_2 = driver.find_element("id", "codeRoom")
code_input_2.send_keys(code)

join_room_button_2 = driver.find_element("id", "joinRoom")
join_room_button_2.click()

#JOUEUR 3
driver.execute_script("window.open('http://localhost:5173/', '_blank');")
tabs = driver.window_handles
driver.switch_to.window(tabs[2])

username_input3 = driver.find_element("id", "username")
username_input3.send_keys("Player 3")

join_game_button_3 = driver.find_element("id", "joinGame")
join_game_button_3.click()

code_input_3 = driver.find_element("id", "codeRoom")
code_input_3.send_keys(code)

join_room_button_3 = driver.find_element("id", "joinRoom")
join_room_button_3.click()

#JOUEUR 4
driver.execute_script("window.open('http://localhost:5173/', '_blank');")
tabs = driver.window_handles
driver.switch_to.window(tabs[3])

username_input4 = driver.find_element("id", "username")
username_input4.send_keys("Player 4")

join_game_button_4 = driver.find_element("id", "joinGame")
join_game_button_4.click()

code_input_4 = driver.find_element("id", "codeRoom")
code_input_4.send_keys(code)

join_room_button_4 = driver.find_element("id", "joinRoom")
join_room_button_4.click()

time.sleep(1)

#LANCER LA GAME
launch_game = driver.find_element("id", "launchGame")
launch_game.click()

tabs = driver.window_handles
driver.switch_to.window(tabs[0])

time.sleep(5000)