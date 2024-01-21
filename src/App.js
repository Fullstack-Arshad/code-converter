import './App.css';

function replaceComment(textInput){
  return textInput.replace(new RegExp("'",'g'),"//")
}

function replaceStringDT(textInput){
  return textInput.replace(new RegExp("\\b"+" As String"+"\\b",'g'),": string")
}

function replaceDim(textInput){
  return textInput.replace(new RegExp("\\b"+"Dim"+"\\b",'g'),"let")
}

function globalReplace(textInput,oldString,newString){
  return textInput.replace(new RegExp("\\b"+oldString+"\\b",'g'),newString)
}

function globalReplaceSubString(textInput,oldString,newString){
  return textInput.replace(new RegExp(oldString,'g'),newString)
}


function formatFunctionName(txt) {
  txt = globalReplace(txt,"Public Function","public async");
  let parts = txt.split(")");
  txt = parts[0] + ") {";
  return txt;
}

function getLineByLineInput(input) {
  let lines = input.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if(lines[i].includes('Public Function')) {
      lines[i] = formatFunctionName(lines[i]);
    }
    if (lines[i].includes('If') && lines[i].includes('=')) {
      lines[i] = globalReplaceSubString(lines[i],"=","==")
    }
    if (lines[i].includes('If') && !lines[i].includes('(')) {
      lines[i] = globalReplace(lines[i],"If ","if (")
      lines[i] = globalReplace(lines[i],"Then",") {")
    }

  }
  return lines.join('\n')
}
function ReplaceTokens(textInput){
  textInput = globalReplaceSubString(textInput,".ToString","?.toString")
  textInput = getLineByLineInput(textInput)
  textInput = replaceComment(textInput)
  textInput = globalReplace(textInput," As String",": string")
  textInput = globalReplace(textInput,"Dim","let")
  textInput = globalReplace(textInput," As Integer",": number")
  textInput = globalReplace(textInput,"Convert.ToString","String")
  textInput = globalReplace(textInput,"Sub","public")
  textInput = globalReplace(textInput,"End Try","}")  
  textInput = globalReplace(textInput,"Try","try {")
  textInput = globalReplace(textInput,"Catch ex As Exception","} catch (ex) {")
  textInput = globalReplace(textInput,"End public","}")
  textInput = globalReplace(textInput,"End If","}")
  textInput = globalReplace(textInput,"End Function","}")
  // textInput = globalReplace(textInput,"If ","if (")
  textInput = globalReplace(textInput,"If","if")
  textInput = globalReplace(textInput,".Rows.Count","?.length")
  textInput = globalReplace(textInput,"Then"," {")
  textInput = globalReplace(textInput,"Next","}")
  textInput = globalReplace(textInput,"Add","push")
  textInput = globalReplace(textInput,"For Each ","for (")
  textInput = globalReplace(textInput,"dr As DataRow In ","const dr of ")
  // textInput = globalReplace(textInput,".Rows",") {")
  textInput = globalReplace(textInput," As DataTable",": any")
  // textInput = globalReplace(textInput,"Public Function","public async")
  textInput = globalReplace(textInput,"Return","return")
  textInput = globalReplace(textInput,"Finally","}finally{")
  textInput = globalReplace(textInput,"True","true")
  textInput = globalReplace(textInput,"False","false")
  textInput = globalReplace(textInput," As Boolean",": boolean")
  textInput = globalReplace(textInput,"Integer.Parse","Number")
  textInput = globalReplace(textInput,"Decimal.Parse","Number")
  textInput = globalReplace(textInput,"Not ","!")
  textInput = globalReplace(textInput,"ByRef ","")
  textInput = globalReplace(textInput,"ByVal ","")
  textInput = globalReplace(textInput,".Trim","?.trim")
  textInput = globalReplace(textInput,"String.Empty","''")
  textInput = globalReplace(textInput,"Regex","RegExp")
  textInput = globalReplace(textInput,"New","new")
  textInput = globalReplace(textInput,"SetOutput","this.SetOutput")
  textInput = globalReplaceSubString(textInput,"<>","!==")
  return textInput;
}


function App() {
  const onConvertClick = () => {
    const textBox = document.getElementById("codeBox")
    const code = textBox.value
    if(code?.length > 0){
      // alert(code)
      const outReference = document.getElementById('outputPanel')
      const convertedCode = ReplaceTokens(code)
      outReference.value = convertedCode
      outReference.select()
      document.execCommand('copy');
    }
    else
    alert("Please Enter some code in the Text Box")
  }

  return (
    <div className='root'>
      <div className='header'>Welcome to code converter</div>
      <div id='prompt'>
      <label>Paste your code in given text box</label>
      </div>
      <div className='textArea'>
        <textarea className='textBox' autoFocus name="textBox" id="codeBox" cols="30" rows="10" placeholder='Enter vb.net code here'></textarea>
        <textarea className='outputBox' readOnly name='output' id='outputPanel' cols="30" rows="10" placeholder='Output Code in Typescript'></textarea>
      </div>
      <div>
        <button onClick={onConvertClick}>Convert</button>
      </div>
    </div>
  );
}

export default App;
