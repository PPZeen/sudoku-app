declare global {
   type StepProps = {
      position: [number, number];
      number: number;
      action:
      | "place"
      | "try"
      | "backtrack"
      | "H place"
      | "H backtrack";
   };

   type SolveBoardProps = {
      isBlind: boolean,
      board: number[][],
      steps: StepProps[],
      showDialog: Dispatch<React.SetStateAction<boolean>>
   }
}

export default global;