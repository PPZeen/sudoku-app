declare global {
   type StepProps = {
      position: [number, number];
      number: number;
      action: "try" | "place" | "backtrack" | "empty";
   };

   type SolveBoardProps = {
      isBlind: boolean,
      board: number[][],
      steps: StepProps[],
      showDialog: Dispatch<React.SetStateAction<boolean>>
   }
}

export default global;