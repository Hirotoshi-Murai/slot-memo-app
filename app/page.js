"use client";

import { useEffect, useState } from "react";

const machineData = {
  東京喰種: {
    fields: ["type", "trigger", "state", "hint"],

    typeButtons: ["レミ", "リゼ", "エピ", "AT"],

    triggerButtons: [
      "ゲーム数",
      "超高確",
      "強チェ",
      "チャンス目",
      "引戻し",
      "確定チェリー",
      "直撃",
    ],

    stateButtons: [
      "示唆なし",
      "B以上",
      "C以上",
      "チャンス以上",
      "天国準備",
      "天国",
      "有馬後",
    ],

    hintButtons: ["デフォ", "奇数", "偶数", "高設定弱", "高設定強"],
  },

  転生2: {
    fields: ["trigger", "state"],

    triggerButtons: ["ゲーム数", "B天井", "C天井", "直撃", "謎当たり"],

    stateButtons: ["示唆なし", "B以上", "天撃後"],
  },
};

export default function Home() {
  const [machine, setMachine] = useState("東京喰種");

  const [game, setGame] = useState("");
  const [type, setType] = useState("");
  const [trigger, setTrigger] = useState("");
  const [state, setState] = useState("");
  const [hint, setHint] = useState("");

  const [records, setRecords] = useState([]);

  const currentMachine = machineData[machine];

  useEffect(() => {
    const saved = localStorage.getItem("slot-records");

    if (saved) {
      setRecords(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("slot-records", JSON.stringify(records));
  }, [records]);

  const resetInputs = () => {
    setGame("");
    setType("");
    setTrigger("");
    setState("");
    setHint("");
  };

  const addRecord = () => {
    if (!game) return;

    let text = game;

    if (type) text += ` ${type}`;
    if (trigger) text += ` ${trigger}`;
    if (state) text += ` ${state}`;
    if (hint) text += ` ${hint}`;

    setRecords([...records, text]);

    resetInputs();
  };

  const deleteRecord = (index) => {
    const updated = records.filter((_, i) => i !== index);
    setRecords(updated);
  };

  const copyRecords = async () => {
  const text = records.join("\n");

  if (!text) return;

  try {
    await navigator.clipboard.writeText(text);
    alert("コピーしました。履歴を削除します。");
    setRecords([]);
  } catch (err) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    document.execCommand("copy");

    document.body.removeChild(textArea);

    alert("コピーしました。履歴を削除します。");
    setRecords([]);
  }
};

  return (
    <div className="min-h-screen bg-gray-100 p-4 text-gray-900">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow p-4 space-y-4">
        <h1 className="text-2xl font-bold">実践メモ</h1>

        <div>
          <label className="block text-sm font-semibold mb-1">機種選択</label>

          <select
            value={machine}
            onChange={(e) => {
              setMachine(e.target.value);
              resetInputs();
            }}
            className="w-full border rounded-xl p-2"
          >
            {Object.keys(machineData).map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">G数</label>

          <input
            type="number"
            placeholder="128"
            value={game}
            onChange={(e) => setGame(e.target.value)}
            className="w-full border rounded-xl p-2 text-lg"
          />
        </div>

        {currentMachine.fields.includes("type") && (
          <div>
            <label className="block text-sm font-semibold mb-2">種類</label>

            <div className="flex flex-wrap gap-2">
              {currentMachine.typeButtons.map((item) => (
                <button
                  key={item}
                  onClick={() => setType(item)}
                  className={`px-3 py-2 rounded-xl text-sm ${
                    type === item ? "bg-black text-white" : "bg-gray-200"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

        {currentMachine.fields.includes("trigger") && (
          <div>
            <label className="block text-sm font-semibold mb-2">当選</label>

            <div className="flex flex-wrap gap-2">
              {currentMachine.triggerButtons.map((item) => (
                <button
                  key={item}
                  onClick={() => setTrigger(item)}
                  className={`px-3 py-2 rounded-xl text-sm ${
                    trigger === item ? "bg-black text-white" : "bg-gray-200"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

        {currentMachine.fields.includes("state") && (
          <div>
            <label className="block text-sm font-semibold mb-2">状態</label>

            <div className="flex flex-wrap gap-2">
              {currentMachine.stateButtons.map((item) => (
                <button
                  key={item}
                  onClick={() => setState(item)}
                  className={`px-3 py-2 rounded-xl text-sm ${
                    state === item ? "bg-black text-white" : "bg-gray-200"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

        {currentMachine.fields.includes("hint") && (
          <div>
            <label className="block text-sm font-semibold mb-2">示唆</label>

            <div className="flex flex-wrap gap-2">
              {currentMachine.hintButtons.map((item) => (
                <button
                  key={item}
                  onClick={() => setHint(item)}
                  className={`px-3 py-2 rounded-xl text-sm ${
                    hint === item ? "bg-black text-white" : "bg-gray-200"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={addRecord}
          className="w-full bg-black text-white rounded-2xl py-3 font-semibold"
        >
          行追加
        </button>

        <div className="border-t pt-4">
          <h2 className="font-bold mb-2">実践履歴</h2>

          <div className="space-y-2 text-sm">
            {records.map((record, index) => (
              <div
                key={index}
                className="bg-gray-100 rounded-xl p-2 flex justify-between items-center gap-2"
              >
                <span>{record}</span>

                <button
                  onClick={() => deleteRecord(index)}
                  className="text-red-500 text-xs shrink-0"
                >
                  削除
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={copyRecords}
          className="w-full bg-blue-600 text-white rounded-2xl py-3 font-semibold"
        >
          メモ用にコピー
        </button>
      </div>
    </div>
  );
}