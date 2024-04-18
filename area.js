

// class Point extends Array {

//   constructor(...args) {
//     super()
    
//     this.dimension = args.length
//     if (args[0] instanceof Point) {

//       args[0].forEach((x, i) => this[i] = x)
//     }
//     else {
//       const valid = args.reduce((result, cur) => {
//         return result && (typeof cur == 'number' || typeof cur == 'bigint')
//       }, true)
  
//       if (!valid) throw Error

//       args.forEach((x, i) => this[i] = x)
//     }

//     Object.freeze(this)
//   }
// }

// const p1 = new Point(1, 2)
// console.log(p1)

// class Axis {

// }

// class LineSegmnet {

//   start
//   end
//   dimension

//   constructor(a, b) {
//     if (a instanceof Point && b instanceof Point) {
//       if (a.dimension == b.dimension) {
//         this.dimension = a.dimension
//         this.start = new Point(a)
//         this.end = new Point(b)
//       }
//     }
//     else if (typeof a == 'number' && b instanceof LineSegmnet) {
//       // 1차원
//     }
//     else if (a instanceof LineSegmnet && typeof b == 'number') {
//       // 1차원
//     }
//     else if (a instanceof Point && b instanceof LineSegmnet) {
//       // n차원
//     }
//     else if (a instanceof LineSegmnet && b instanceof Point) {
//       // n차원
//     }
//     else {
//       throw Error
//     }
//   }

//   static from(a) {
//     return {
//       to(b) {
//         return new LineSegmnet(new Point(a), new Point(b))
//       },
//       length(len) {
//         return new LineSegmnet(new Point(a), new Point(a + len))
//       }
//     } 
//   }
// }

// const s1 = new LineSegmnet(new Point(0, 4), new Point(0, 6))
// const s2 = LineSegmnet.from(10).to(11)
// console.log(s2)


// class Schedule {

//   dayOfWeek
//   start
//   end
//   details

//   constructor(dayOfWeek, start, end, details = {}) {
//     this.dayOfWeek = dayOfWeek
//     this.start = start
//     this.end = end
//     this.details = details
//   }

//   /**
//    * 
//    * @param {Schedule | Array<Schedule>} scheduleA
//    * @param {Schedule | Array<Schedule>} scheduleB
//    */
//   static overlaps = (scheduleA, scheduleB) => {

//     let a = scheduleA
//     let b = scheduleB

//     if (a instanceof Schedule) a = [a]
//     if (b instanceof Schedule) b = [b]

//     return a.reduce((a_acc, a_cur) => {
//       return a_acc || b.reduce((b_acc, b_cur) => {
//         return b_acc || !(a_cur.start > b_cur.end || b_cur.start > a_cur.end)
//       }, false)
//     }, false)
//   }
// }

// // console.log(24 * 60 * 60) // 86400

// const s1 = new Schedule(0, 3600, 7200)
// const s2 = new Schedule(0, 7600, 8000)


