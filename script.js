let zipFile = null;
let manifestPath = null;

document.getElementById('upload').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const arrayBuffer = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(arrayBuffer);

  const path = Object.keys(zip.files).find(name => name.endsWith('manifest.json'));
  if (!path) {
    document.getElementById('output').textContent = "manifest.json が見つかりませんでした。";
    return;
  }

  const manifestText = await zip.file(path).async("string");
  zipFile = zip;
  manifestPath = path;

  document.getElementById('jsonViewer').value = manifestText;
  document.getElementById('jsonViewer').style.display = "block";
  document.getElementById('saveBtn').style.display = "inline-block";
  document.getElementById('output').textContent = `📄 ${manifestPath} を読み込みました`;
});

document.getElementById('saveBtn').addEventListener('click', async () => {
  const newText = document.getElementById('jsonViewer').value;

  try {
    JSON.parse(newText); // JSONの整合性チェック

    zipFile.file(manifestPath, newText); // manifestを上書き
    const blob = await zipFile.generateAsync({ type: "blob" });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "manifest_editorで編集.mcpack";
    a.click();
  } catch (err) {
    alert("⚠️ JSONの形式が正しくないようです。");
    console.error(err);
  }
});