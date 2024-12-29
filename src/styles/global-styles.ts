import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  html,
  body {
    height: 100%;
    width: 100%;
    font-size: 14px;
  }

 *{ 
  font-family: "Inter", sans-serif;
  font-optical-sizing: auto;
  font-style: normal;
  }

/* width */
.ant-table-body::-webkit-scrollbar,
::-webkit-scrollbar {
  width: 7px;
  height: 7px;
}

/* Track */
.ant-table-body::-webkit-scrollbar-track,
::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 5px;
}

/* Handle */
.ant-table-body::-webkit-scrollbar-thumb ,
::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 5px;
}

/* Handle on hover */
.ant-table-body::-webkit-scrollbar-thumb:hover,
::-webkit-scrollbar-thumb:hover {
  background: #888;
}

.ant-table-body {
  scrollbar-width: auto;
  scrollbar-color: auto;
}



`;
