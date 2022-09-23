import React, { useState } from "react";
import axios from "axios";
import "antd/dist/antd.min.css";
import {
  AudioOutlined,
  PlayCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Input, Typography, Divider, Button, Space, Tree } from "antd";
import ReactPlayer from "react-player";
const { Search } = Input;
const { Text } = Typography;

const suffix = (
  <AudioOutlined
    style={{
      fontSize: 16,
      color: "",
    }}
    className="text-[16px] text-[#1890ff]"
    onClick={() => {
      console.log("OK");
    }}
  />
);

export default function SearchPage() {
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [wordInfos, setWordInfos] = useState([]);
  const [isPlayAudio, setIsPlayAudio] = useState(false);

  const searchOnFullAPI = (word) => {
    setIsLoadingSearch(true);
    axios
      .get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
      .then((data) => {
        console.log(data);
        setIsLoadingSearch(false);
      })
      .catch((err) => {
        setIsLoadingSearch(false);
        console.log("err", err);
      });
  };

  const searchOnMeetDev = (word) => {
    axios
      .get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
      .then((data) => {
        console.log(data);
        setWordInfos(data.data);
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const onSearch = (value) => {
    // searchOnFullAPI(value.toLowerCase());
    searchOnMeetDev(value.toLowerCase());
  };

  return (
    <div className="page-content-container">
      <div className="w-[400px] mx-auto">
        <Search
          placeholder="word to search"
          allowClear
          enterButton
          size="default"
          onSearch={onSearch}
          loading={isLoadingSearch}
          suffix={suffix}
        />

        {/* <button className="custom-button btn-13">Search</button> */}
      </div>
      <div>
        {wordInfos?.length !== 0 && (
          <React.Fragment>
            {wordInfos.map((wordInfo, index) => {
              return (
                <React.Fragment key={index}>
                  <div>
                    <Typography.Text strong className="block text-[1.6em]">
                      {wordInfo.word}
                    </Typography.Text>
                    <Typography.Text italic>
                      {wordInfo.phonetic}
                    </Typography.Text>
                  </div>

                  <Button
                    className="block"
                    small="true"
                    icon={<PlusOutlined />}
                  >
                    Add this word
                  </Button>
                  {wordInfo.meanings?.length &&
                    wordInfo.meanings.map((meaning, index) => {
                      return (
                        <div key={index}>
                          <Tree
                            onSelect={(key) => {
                              console.log(key);
                            }}
                            defaultExpandedKeys={["0", "0-0-1"]}
                            treeData={[
                              {
                                title: meaning.partOfSpeech,
                                key: "0",
                                autoExpandParent: true,
                                children: meaning.definitions.map(
                                  (definition, index) => {
                                    return {
                                      title: definition.definition,
                                      key: `0-${index}`,
                                      disableCheckbox: true,
                                      autoExpandParent: true,
                                      children: [
                                        {
                                          title:
                                            "Example: " + definition.example,
                                          key: `0-${index}-0`,
                                          disableCheckbox: true,
                                        },
                                      ],
                                    };
                                  }
                                ),
                              },
                            ]}
                          />
                        </div>
                      );
                    })}
                  <Divider plain></Divider>
                </React.Fragment>
              );
            })}
            {/* <Text>{JSON.stringify(wordInfos)}</Text> */}
          </React.Fragment>
        )}
      </div>
    </div>
  );
}
