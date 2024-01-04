# Admin Web

## References

- [climate action visualizer](https://github.com/mkraenz/typescript-teatime/blob/main/e117-climate-action-visualizer/src/components/theme.ts)
- [meetmecal](https://github.com/mkraenz/meetmecal/tree/main/app/src/pages/admin)

## Development

### Common errors Q&A

Q: I see the loading spinner saying "Resuming last session" on navigating to a page. Why is that?

A: You need to use react-router-dom's navigation `useNavigate()` or `import {Link} from 'react-router-dom'` similar instead of a plain href. Otherwise the page the session will be lost.
