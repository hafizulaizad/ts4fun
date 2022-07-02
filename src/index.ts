import fs from "fs";
import path from "path";

interface inputFile {
  PartNo: string;
  LotNo: string;
  Sample: string;
  PanelID: number;
  CriterionInternal: string;
  CriterionCofC: string;
  Position: string;
  PTH: string;
  MeasuringPoint: string;
  MeasuringValue: string;
  LSL: string;
  USL: string;
  LCL: string;
  UCL: string;
}

//All are done here//
const directoryPath = path.join(__dirname, "./files");

fs.readdir(directoryPath, function (err, files) {
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }
  files.forEach(function (file) {
    console.log(file);
    //check file name using regex
    const targetString: string = file;
    const rExp: RegExp = /^[a-zA-Z]{4}[0-9]{4}_[0-9]{12}_section.csv/gi;
    var test = rExp.test(targetString);
    if (test) {
      let res = [];
      let arrIn = [];
      let fileName = [];
      res = readFile("dist/files/" + targetString);

      //TODO  get filename and make it into arrays
      fileName = checkName(targetString);
      // console.log(fileName[0]);
      arrIn = reconstructArr(res);
      //TODO check if arrIn[partno] == filename[partno] and  arrIn[lotno] == filename[lotno]
      res = checkNameWData(arrIn, fileName);
      res = checkWhitespace(res);
      res = checkInteger(res);

      console.log(res);
    }

    console.log(test);
  });
});

function readFile(targetString) {
  let result = [];
  //Read file
  const data = fs.readFileSync(targetString);
  //Split rows
  var [, ...data_array] = data.toString().split("\n");

  //Read each data.
  for (let i = 1; i < data_array.length - 1; i++) {
    let str_temp = data_array[i];
    let data_str = "";

    let flag = 0;
    //Insert insert each data in " "
    for (let ch of str_temp) {
      if (ch === '"' && flag === 0) {
        flag = 1;
      } else if (ch === '"' && flag == 1) flag = 0;
      if (ch === "," && flag === 0) ch = "|";
      if (ch !== '"') data_str += ch;
    }

    //Split data with others.
    let properties = data_str.split("|");

    result.push(properties);
  }
  //console.log(result);
  return result;
}

function reconstructArr(result) {
  const arr: inputFile[] = [];
  for (let i = 0; i < result.length; i++) {
    const transformedObj: inputFile = {
      PartNo: result[i][0],
      LotNo: result[i][1],
      Sample: result[i][2],
      PanelID: parseInt(result[i][3]),
      CriterionInternal: result[i][4],
      CriterionCofC: result[i][5],
      Position: result[i][6],
      PTH: result[i][7],
      MeasuringPoint: result[i][8],
      MeasuringValue: result[i][9],
      LSL: result[i][10],
      USL: result[i][11],
      LCL: result[i][12],
      UCL: result[i][13],
    };
    arr.push(transformedObj);
  }
  return arr;
}

function checkName(filename) {
  let arrName = [];
  arrName = filename.split("_");
  return arrName;
}

function checkNameWData(inputArr, filenameArr) {
  const arr: inputFile[] = [];
  for (let i = 0; i < inputArr.length; i++) {
    if (
      filenameArr[0] === inputArr[i]["PartNo"] &&
      filenameArr[1] === inputArr[i]["LotNo"]
    ) {
      arr.push(createObj(inputArr[i]));
    }
  }
  return arr;
}

function checkWhitespace(inputArr) {
  const arr: inputFile[] = [];

  for (let i = 0; i < inputArr.length; i++) {
    //get key
    let val = Object.values(inputArr[i]);
    if (!val.some((value) => value === "")) {
      arr.push(createObj(inputArr[i]));
    }
  }
  return arr;
}

function checkInteger(inputArr) {
  let arr = [];
  for (let i = 0; i < inputArr.length; i++) {
    //get values
    if (typeof inputArr[i]["PanelID"] === "number") {
      arr.push(createObj(inputArr[i]));
    }
  }
  return arr;
}

function createObj(inputArr) {
  return {
    PartNo: inputArr["PartNo"],
    LotNo: inputArr["LotNo"],
    Sample: inputArr["Sample"],
    PanelID: inputArr["PanelID"],
    CriterionInternal: inputArr["CriterionInternal"],
    CriterionCofC: inputArr["CriterionCofC"],
    Position: inputArr["Position"],
    PTH: inputArr["PTH"],
    MeasuringPoint: inputArr["MeasuringPoint"],
    MeasuringValue: inputArr["MeasuringValue"],
    LSL: inputArr["LSL"],
    USL: inputArr["USL"],
    LCL: inputArr["LCL"],
    UCL: inputArr["UCL"],
  };
}
