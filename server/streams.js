// для загрузки больших объемов данных

const fs = require('fs')
const server = require('http').createServer()

// создание файла чанками (частями) в потоке

// const file = fs.createWriteStream('./data/mock-data.txt')

// for(let i = 0; i <= 100; i++) {
//   file.write('very large text \n very large text \n very large text \n very large text \n very large text \n ')
// }

// // закрыть поток (завершение записи)
// file.end()

// чтение файла чанками (частями) в потоке

server.on('request', (req, res) => {
  const file = fs.createReadStream('./data/mock-data.txt')

  // pipe - функция, что просто соединяет поток на чтение и соединяет его вывод с вводом потока на запись
  // просто труба(шланг) подачи воды в сад из крана
  file.pipe(res)
  // при использовании пайп - автоматически закрывается один поток другим
})

server.listen(8080)
