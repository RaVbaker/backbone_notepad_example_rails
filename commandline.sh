# tworzymy aplikację: (bez Prototype jak już ustaliliśmy)
rails new example_notepad_app -J 
cd example_notepad_app                                  

# dodajemy obsluge jQuery (via: https://github.com/rails/jquery-ujs/blob/master/README.md ):
echo "gem 'jquery-rails', '>= 0.2.6'" >> Gemfile

#instalujemy potrzebne gemy:                          
bundle install              
                             
# dodajemy jquery do aplikacji (z obsługa UI)
rails generate jquery:install --ui


